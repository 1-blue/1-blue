import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServerClient } from "@1-blue/database/server";
import { createCbt } from "../src/lib/repository";
import { SEED_CBTS } from "./seed-data/index";

const __dirname = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(__dirname, "..");

const loadEnv = () => {
  const envPath = resolve(appRoot, ".env");
  const content = readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }
    const eq = trimmed.indexOf("=");
    if (eq === -1) {
      continue;
    }
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
};

/** app_siheomform.cbts 삭제 시 FK CASCADE로 하위 테이블도 함께 비워집니다. */
const truncateSiheomform = async () => {
  const db = createServerClient("app_siheomform");
  const { error } = await db.from("cbts").delete().gte("created_at", "1970-01-01T00:00:00Z");
  if (error) {
    throw new Error(`truncate failed: ${error.message}`);
  }
};

const main = async () => {
  loadEnv();

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:7005";

  console.log("Truncating app_siheomform (cbts CASCADE only, other schemas untouched)...");
  await truncateSiheomform();

  console.log(`Seeding ${SEED_CBTS.length} CBTs...`);
  const results: Array<{
    title: string;
    publicId: string;
    adminToken: string;
    questionCount: number;
  }> = [];

  for (const entry of SEED_CBTS) {
    const created = await createCbt(entry.draft, {
      adminToken: entry.spec.adminToken,
      publicId: entry.spec.publicId,
    });
    results.push({
      title: entry.spec.title,
      publicId: created.publicId,
      adminToken: created.adminToken,
      questionCount: created.questionCount,
    });
    console.log(`  ✓ ${entry.spec.title}`);
  }

  console.log("\n========== 시드 완료 ==========\n");
  for (const row of results) {
    console.log(`[${row.title}] (${row.questionCount}문항)`);
    console.log(`  응시: ${siteUrl}/cbt/${row.publicId}`);
    console.log(`  관리: ${siteUrl}/manage/${row.adminToken}`);
    console.log("");
  }
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
