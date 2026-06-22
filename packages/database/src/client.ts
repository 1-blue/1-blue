import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { AppSchema, Database } from "./types/database";

export type { AppSchema, Database } from "./types/database";

/** 스키마별로 좁혀진 Supabase 클라이언트 */
export type SchemaClient<S extends AppSchema | "public"> = SupabaseClient<Database, S>;

export type CreateBrowserClientOptions<S extends AppSchema | "public" = "public"> = {
  schema?: S;
};

const getBrowserCredentials = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return { url, anonKey };
};

/** Realtime 등 DB 쿼리 없이 사용할 때 */
export function createBrowserClient(): SchemaClient<"public">;
/** 앱 스키마 지정 시 해당 스키마 테이블 타입으로 좁혀집니다 */
export function createBrowserClient<S extends AppSchema>(
  options: CreateBrowserClientOptions<S> & { schema: S },
): SchemaClient<S>;
export function createBrowserClient<S extends AppSchema>(
  options: CreateBrowserClientOptions<S> = {},
): SchemaClient<S> | SchemaClient<"public"> {
  const { url, anonKey } = getBrowserCredentials();
  const schema = options.schema;

  if (schema) {
    return createClient(url, anonKey, {
      db: { schema },
    }) as unknown as SchemaClient<S>;
  }

  return createClient(url, anonKey) as SchemaClient<"public">;
}

export const getSchemaName = (appSlug: string): AppSchema => {
  return `app_${appSlug.replace(/-/g, "_")}` as AppSchema;
};
