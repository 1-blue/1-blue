import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { AppSchema, Database } from "../types/database";

export type { AppSchema, Database } from "../types/database";

/** 스키마별로 좁혀진 Supabase 클라이언트. 동일 테이블명이 여러 스키마에 있어도 컬럼 타입이 섞이지 않습니다. */
export type SchemaClient<S extends AppSchema | "public"> = SupabaseClient<Database, S>;

const getServerCredentials = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  return { url, serviceRoleKey };
};

/** Realtime 등 DB 쿼리 없이 사용할 때 */
export function createServerClient(): SchemaClient<"public">;
/** 앱 스키마의 테이블에 접근할 때 — 스키마를 반드시 지정합니다 */
export function createServerClient<S extends AppSchema>(schema: S): SchemaClient<S>;
export function createServerClient<S extends AppSchema>(
  schema?: S,
): SchemaClient<S> | SchemaClient<"public"> {
  const { url, serviceRoleKey } = getServerCredentials();

  if (schema) {
    return createClient(url, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      db: { schema },
    }) as unknown as SchemaClient<S>;
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  }) as SchemaClient<"public">;
}
