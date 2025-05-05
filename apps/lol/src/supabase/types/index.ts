import { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "#src/supabase/types/database";

export type TypedSupabaseClient = SupabaseClient<Database>;
