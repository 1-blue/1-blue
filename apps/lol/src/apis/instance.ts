import { createClient } from "@supabase/supabase-js";
import ky from "ky";

// Supabase URL 및 키 확인
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const anon_key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const service_role_key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// 클라이언트용 Supabase 인스턴스 (익명 키 사용)
export const supabase = createClient(supabaseUrl, anon_key);

// 서버 API 전용 Supabase 인스턴스 (서비스 롤 키 사용)
export const adminSupabase = createClient(supabaseUrl, service_role_key);

// 리그 오브 레전드 API 클라이언트
export const lolInstance = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_LOL_API_URL,
  timeout: 30000,
  retry: 3,
});

export const serverInstance = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_SERVER_URL,
});
