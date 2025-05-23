import { getSupabaseFromAdminRole } from "@1-blue/supabase/server";
import { type ChampionData } from "#src/apis";
import { LOL_API_ENDPOINT } from "#src/constants";

/**
 * 챔피언 기본 정보를 Supabase DB에 저장하는 함수
 * @param championData 챔피언 상세 데이터
 * @returns 저장 성공 여부
 */
const saveChampionToDB = async (championData: ChampionData) => {
  try {
    const supabase = getSupabaseFromAdminRole();

    const championInfo = {
      id: championData.id,
      key: championData.key,
      name: championData.name,
      title: championData.title,
      splash_image_url:
        process.env.NEXT_PUBLIC_LOL_API_URL +
        "/" +
        LOL_API_ENDPOINT.championSplashImage(
          championData.id,
          championData.skins[0].num
        ),
      loading_image_url:
        process.env.NEXT_PUBLIC_LOL_API_URL +
        "/" +
        LOL_API_ENDPOINT.championLoadingImage(
          championData.id,
          championData.skins[0].num
        ),
      square_image_url:
        process.env.NEXT_PUBLIC_LOL_API_URL +
        "/" +
        LOL_API_ENDPOINT.championSquareImage(championData.id),
      tags: championData.tags,
      version: process.env.NEXT_PUBLIC_LOL_API_VERSION,
      lore: championData.lore,
      blurb: championData.blurb,
      allytips: championData.allytips,
      enemytips: championData.enemytips,
    };

    const { error, ...props } = await supabase
      .schema("lol")
      .from("champions")
      .upsert(championInfo, {
        onConflict: "id",
        ignoreDuplicates: false,
      });

    if (error) {
      console.error(`챔피언 데이터 저장 오류:`, error);
      console.log("🚀 props >> ", props);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`챔피언 저장 중 예외 발생:`, JSON.stringify(error));
    return false;
  }
};

export { saveChampionToDB };
