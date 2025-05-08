import { MetadataRoute } from "next";
import { getSupabaseFromAnnoRole } from "@1-blue/supabase";

// 환경 변수에서 기본 URL 가져오기 (없으면 로컬 주소 사용)
const BASE_URL = process.env.NEXT_PUBLIC_CLIENT_URL;

// Supabase에서 가져올 데이터 타입 정의 (선택적이지만 권장)
interface SkinSitemapData {
  skin_name: string | null;
  created_at: string | null; // 또는 데이터베이스 타입에 맞는 Date 등
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. 정적 경로 정의
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/how-to-play`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/skins`, // 스킨 갤러리 페이지 경로 (실제 경로에 맞게 수정)
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7, // 예시 우선순위
    },
    // 필요시 다른 정적 경로 추가 (예: /rankings)
  ];

  // 2. 동적 경로 (스킨 상세 페이지) 생성
  let dynamicSkinRoutes: MetadataRoute.Sitemap = [];
  try {
    const supabase = getSupabaseFromAnnoRole();
    const { data: skins, error } = await supabase
      .schema("lol")
      .from("champion_skins")
      .select("skin_name, created_at") // 필요한 컬럼만 선택
      .returns<SkinSitemapData[]>(); // 가져온 데이터 타입 명시

    if (error) {
      console.error("Sitemap: 스킨 데이터 조회 오류:", error);
      // 오류 발생 시 동적 경로는 비워둠 (또는 다른 처리)
    } else if (skins) {
      dynamicSkinRoutes = skins
        .filter((skin) => !!skin.skin_name) // skin_name이 유효한 경우만 필터링
        .map((skin) => {
          // lastModified 날짜 처리 (created_at이 없으면 현재 날짜 사용)
          const lastModified = skin.created_at
            ? new Date(skin.created_at)
            : new Date();
          return {
            url: `${BASE_URL}/champions/skins/${encodeURIComponent(skin.skin_name!)}`,
            lastModified: lastModified,
            changeFrequency: "monthly", // 스킨 정보 변경 빈도에 따라 조절
            priority: 0.6, // 동적 페이지 우선순위
          };
        });
    }
  } catch (e) {
    console.error("Sitemap: 동적 경로 생성 중 예외 발생:", e);
  }

  // 3. 정적 경로와 동적 경로 결합하여 반환
  return [...staticRoutes, ...dynamicSkinRoutes];
}
