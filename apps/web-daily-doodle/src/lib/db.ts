import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@1-blue/database/types";

export const SCHEMA = "app_daily_doodle" as const;

export type DailyDoodleDb = SupabaseClient<Database, typeof SCHEMA>;

export const getDb = (): DailyDoodleDb => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient<Database, typeof SCHEMA>(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    db: { schema: SCHEMA },
  });
};
