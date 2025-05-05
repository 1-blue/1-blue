import { createClient } from "@supabase/supabase-js";

// Supabase URL 및 키 확인
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const anon_key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// 클라이언트용 Supabase 인스턴스 (익명 키 사용)
export const anonSupabase = createClient(supabaseUrl, anon_key);
