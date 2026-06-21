import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { AppSchema, Database } from "./types/database";

export type CreateBrowserClientOptions = {
  schema?: AppSchema | "public";
};

export type DatabaseClient = SupabaseClient<Database, "public" | AppSchema>;

export const createBrowserClient = (options: CreateBrowserClientOptions = {}): DatabaseClient => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return createClient<Database, "public" | AppSchema>(url, anonKey, {
    db: options.schema ? { schema: options.schema } : undefined,
  });
};

export const getSchemaName = (appSlug: string): AppSchema => {
  return `app_${appSlug.replace(/-/g, "_")}` as AppSchema;
};
