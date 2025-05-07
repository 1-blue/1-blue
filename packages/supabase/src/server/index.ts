import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_URL");
}

let supabaseAdminInstance: SupabaseClient<Database> | null = null;

export const getSupabaseFromAdminRole = (): SupabaseClient<Database> => {
  if (!supabaseServiceRoleKey) {
    throw new Error(
      "Missing environment variable: SUPABASE_SERVICE_ROLE_KEY. This client is server-side only."
    );
  }

  if (!supabaseAdminInstance) {
    supabaseAdminInstance = createClient<Database>(
      supabaseUrl,
      supabaseServiceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
  }
  return supabaseAdminInstance;
};
