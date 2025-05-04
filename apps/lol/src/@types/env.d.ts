declare namespace NodeJS {
  interface ProcessEnv {
    /** 실행 타입 */
    readonly NODE_ENV: "development" | "production";

    /** 클라이언트 URL */
    readonly NEXT_PUBLIC_CLIENT_URL: string;
    /** 서버 URL */
    readonly NEXT_PUBLIC_SERVER_URL: string;

    /** Supabase URL */
    readonly NEXT_PUBLIC_SUPABASE_URL: string;
    /** Supabase Anon Key */
    readonly NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    /** Supabase Service Role Key */
    readonly SUPABASE_SERVICE_ROLE_KEY: string;

    /** 리그 오브 레전드 API 버전 */
    readonly NEXT_PUBLIC_LOL_API_VERSION: string;
    /** 리그 오브 레전드 API 로케일 */
    readonly NEXT_PUBLIC_LOL_API_LOCALE: string;
    /** 리그 오브 레전드 API URL */
    readonly NEXT_PUBLIC_LOL_API_URL: string;
  }
}
