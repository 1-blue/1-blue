#!/usr/bin/env node
import {
  cpSync,
  existsSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  readdirSync,
  statSync,
} from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "../..");
const appsDir = join(root, "apps");

const NEXT_PORT_START = 7000;
const NEXT_PORT_END = 7599;
const EXPO_PORT_START = 8000;
const EXPO_PORT_END = 8599;

const TEMPLATE_MAP = {
  "web-static": { template: "_template-web-static", prefix: "web", portKey: "web" },
  "web-api": { template: "_template-web-api", prefix: "web", portKey: "web" },
  ait: { template: "_template-ait", prefix: "ait", portKey: "ait" },
  expo: { template: "_template-expo", prefix: "expo", portKey: "expo" },
};

const parseArgs = () => {
  const args = process.argv.slice(2);
  const result = { type: "web-static", slug: "", name: "" };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--type" && args[i + 1]) result.type = args[++i];
    else if (args[i] === "--slug" && args[i + 1]) result.slug = args[++i];
    else if (args[i] === "--name" && args[i + 1]) result.name = args[++i];
  }

  return result;
};

const replaceInFile = (filePath, replacements) => {
  if (!existsSync(filePath)) return;
  let content = readFileSync(filePath, "utf-8");
  for (const [key, value] of Object.entries(replacements)) {
    content = content.split(key).join(value);
  }
  writeFileSync(filePath, content);
};

const walk = (dir, replacements) => {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (["node_modules", ".next", "out", "dist"].includes(entry)) continue;
      walk(full, replacements);
    } else if (
      /\.(ts|tsx|json|md|mjs|txt|js|example|yaml)$/.test(entry) ||
      entry === ".env.example"
    ) {
      replaceInFile(full, replacements);
    }
  }
};

const collectUsedPorts = (registry) => {
  const used = new Set();

  for (const app of registry.apps) {
    if (app.ports?.web) used.add(app.ports.web);
    if (app.ports?.ait) used.add(app.ports.ait);
    if (app.ports?.expo) used.add(app.ports.expo);
  }

  for (const entry of readdirSync(appsDir)) {
    if (entry.startsWith("_template")) continue;
    const pkgPath = join(appsDir, entry, "package.json");
    if (!existsSync(pkgPath)) continue;
    const content = readFileSync(pkgPath, "utf-8");
    const portMatches = content.matchAll(/(?:--port|--port=|-p\s+)(\d{4})/g);
    for (const match of portMatches) {
      used.add(Number(match[1]));
    }
  }

  return used;
};

const allocatePort = (used, start, end) => {
  for (let port = start; port <= end; port++) {
    if (!used.has(port)) {
      used.add(port);
      return port;
    }
  }
  throw new Error(`No free ports between ${start} and ${end}`);
};

const getWebPortForSlug = (registry, slug) => {
  const entry = registry.apps.find((a) => a.slug === slug);
  return entry?.ports?.web ?? null;
};

const syncRootDevScripts = (registry) => {
  const rootPkgPath = join(root, "package.json");
  const rootPkg = JSON.parse(readFileSync(rootPkgPath, "utf-8"));

  const baseScripts = Object.fromEntries(
    Object.entries(rootPkg.scripts).filter(([key]) => !key.startsWith("dev:")),
  );

  const devScripts = {};

  for (const app of registry.apps) {
    const { slug, templates } = app;
    const hasWeb = templates.some((t) => t === "web-static" || t === "web-api");
    const hasAit = templates.includes("ait");
    const hasExpo = templates.includes("expo");

    if (hasWeb) {
      devScripts[`dev:${slug}`] = `pnpm --filter web-${slug} dev`;
    } else if (hasAit) {
      devScripts[`dev:${slug}`] = `pnpm --filter ait-${slug} dev`;
    } else if (hasExpo) {
      devScripts[`dev:${slug}`] = `pnpm --filter expo-${slug} dev`;
    }

    if (hasAit) {
      devScripts[`dev:${slug}:ait`] = `pnpm --filter ait-${slug} dev`;
    }
    if (hasExpo) {
      devScripts[`dev:${slug}:expo`] = `pnpm --filter expo-${slug} dev`;
    }
  }

  const sortedDevScripts = Object.fromEntries(
    Object.keys(devScripts)
      .sort()
      .map((key) => [key, devScripts[key]]),
  );

  rootPkg.scripts = { ...baseScripts, ...sortedDevScripts };
  writeFileSync(rootPkgPath, JSON.stringify(rootPkg, null, 2) + "\n");
};

const main = () => {
  const { type, slug, name } = parseArgs();

  if (!slug || !name) {
    console.error('Usage: pnpm create:app --type web-static --slug my-app --name "My App"');
    process.exit(1);
  }

  const config = TEMPLATE_MAP[type];
  if (!config) {
    console.error(`Unknown type: ${type}. Valid: ${Object.keys(TEMPLATE_MAP).join(", ")}`);
    process.exit(1);
  }

  const templateDir = join(appsDir, config.template);
  const appDir = join(appsDir, `${config.prefix}-${slug}`);

  if (!existsSync(templateDir)) {
    console.error(`Template not found: ${templateDir}`);
    process.exit(1);
  }

  if (existsSync(appDir)) {
    console.error(`App already exists: ${appDir}`);
    process.exit(1);
  }

  const registryPath = join(appsDir, "registry.json");
  const registry = JSON.parse(readFileSync(registryPath, "utf-8"));
  const usedPorts = collectUsedPorts(registry);

  let port;
  let expoPort;
  let webPort = getWebPortForSlug(registry, slug);

  if (type === "expo") {
    expoPort = allocatePort(usedPorts, EXPO_PORT_START, EXPO_PORT_END);
    if (!webPort) {
      webPort = allocatePort(usedPorts, NEXT_PORT_START, NEXT_PORT_END);
    }
  } else if (type === "ait") {
    port = allocatePort(usedPorts, NEXT_PORT_START, NEXT_PORT_END);
  } else {
    const existingEntry = registry.apps.find((a) => a.slug === slug);
    if (existingEntry?.ports?.web && !existsSync(join(appsDir, `web-${slug}`))) {
      port = existingEntry.ports.web;
      usedPorts.add(port);
    } else {
      port = allocatePort(usedPorts, NEXT_PORT_START, NEXT_PORT_END);
    }
    webPort = port;
  }

  cpSync(templateDir, appDir, { recursive: true });

  const replacements = {
    "{{SLUG}}": slug,
    "{{APP_NAME}}": name,
    "{{APP_DESCRIPTION}}": `${name} service`,
    "web-template-static": `web-${slug}`,
    "web-template-api": `web-${slug}`,
    "ait-template": `ait-${slug}`,
    "expo-template": `expo-${slug}`,
    "{{APP_NAME_GRANITE}}": name,
    "{{APP_NAME_CAMEL}}": slug.replace(/-([a-z])/g, (_, c) => c.toUpperCase()),
    "{{PORT}}": String(type === "expo" ? expoPort : port),
    "{{EXPO_PORT}}": String(expoPort ?? ""),
    "{{WEB_PORT}}": String(webPort ?? port ?? ""),
  };

  if (type === "ait" && port) {
    replacements["const devPort = 7000"] = `const devPort = ${port}`;
  }

  walk(appDir, replacements);

  const pkgPath = join(appDir, "package.json");
  if (existsSync(pkgPath)) {
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
    pkg.name = `${config.prefix}-${slug}`;
    writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  }

  const existing = registry.apps.find((a) => a.slug === slug);

  if (existing) {
    if (!existing.templates.includes(type)) {
      existing.templates.push(type);
    }
    existing.channels.vercel = existing.channels.vercel || type.startsWith("web");
    existing.channels.ait = existing.channels.ait || type === "ait";
    existing.channels.playStore = existing.channels.playStore || type === "expo";
    existing.hasDatabase = existing.hasDatabase || type === "web-api";
    existing.monetization.adsense = existing.monetization.adsense || type.startsWith("web");
    existing.monetization.admob = existing.monetization.admob || type === "expo";
    existing.monetization.aitAds = existing.monetization.aitAds || type === "ait";
    existing.ports = existing.ports ?? {};
    if (type === "expo") {
      existing.ports.expo = expoPort;
    } else if (type === "ait") {
      existing.ports.ait = port;
    } else {
      existing.ports.web = port;
    }
  } else {
    const ports =
      type === "expo"
        ? { expo: expoPort, web: webPort }
        : type === "ait"
          ? { ait: port }
          : { web: port };

    registry.apps.push({
      slug,
      displayName: name,
      templates: [type],
      channels: {
        vercel: type.startsWith("web"),
        ait: type === "ait",
        playStore: type === "expo",
      },
      hasDatabase: type === "web-api",
      monetization: {
        adsense: type.startsWith("web"),
        admob: type === "expo",
        aitAds: type === "ait",
      },
      ports,
      vercelProjectId: null,
      adsenseClientId: null,
      createdAt: new Date().toISOString().split("T")[0],
      status: "draft",
    });
  }

  writeFileSync(registryPath, JSON.stringify(registry, null, 2) + "\n");
  syncRootDevScripts(registry);

  if (type === "web-api") {
    const schemaSlug = slug.replace(/-/g, "_");
    const migrationDir = join(root, "supabase/migrations");
    mkdirSync(migrationDir, { recursive: true });
    const ts = new Date()
      .toISOString()
      .replace(/[-:T.Z]/g, "")
      .slice(0, 14);
    const migrationFile = join(migrationDir, `${ts}_create_schema_${schemaSlug}.sql`);
    const templateSql = readFileSync(
      join(root, "supabase/migrations/00000000000000_schema_template.sql"),
      "utf-8",
    );
    writeFileSync(migrationFile, templateSql.replace(/\{SCHEMA\}/g, schemaSlug));
  }

  console.log(`Created app: ${appDir}`);
  console.log(`Registered in apps/registry.json`);
  if (type === "expo") {
    console.log(`Ports: Expo Metro ${expoPort}, WebView → web port ${webPort}`);
    console.log(`Run: pnpm dev:${slug}:expo`);
  } else if (type === "ait") {
    console.log(`Port: ${port}`);
    console.log(`Run: pnpm dev:${slug}:ait`);
    console.log(`Config: see ${appDir}/ENV.md`);
  } else {
    console.log(`Port: ${port}`);
    console.log(`Run: pnpm dev:${slug}`);
    console.log(`Env: cp ${appDir}/.env.example ${appDir}/.env.local`);
  }
};

main();
