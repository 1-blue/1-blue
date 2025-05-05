import { createClient } from "@supabase/supabase-js";

// Supabase URL 및 키 확인
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const service_role_key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// 서버 API 전용 Supabase 인스턴스 (서비스 롤 키 사용)
export const adminSupabase = createClient(supabaseUrl, service_role_key);
