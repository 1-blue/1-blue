import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { AppSchema, Database } from "../types/database";

export type DatabaseClient = SupabaseClient<Database, "public" | AppSchema>;

export const createServerClient = (schema?: AppSchema | "public"): DatabaseClient => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient<Database, "public" | AppSchema>(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    db: schema ? { schema } : undefined,
  });
};
