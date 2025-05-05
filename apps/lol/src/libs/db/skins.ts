import { adminSupabase } from "#src/apis/adminSupabase";
import { type ChampionData } from "#src/apis";
import { LOL_API_ENDPOINT, VERSION } from "#src/constants";

interface SkinInsertData {
  champion_id: string;
  champion_name: string;
  skin_id: string;
  skin_num: number;
  skin_name: string;
  splash_image_url: string;
  loading_image_url: string;
  square_image_url: string;
  has_chromas: boolean;
  version: string;
}

/**
 * 챔피언의 스킨 정보를 Supabase DB에 저장하는 함수
 * @param championData 챔피언 상세 데이터
 * @returns 저장 성공 여부
 */
export async function saveChampionSkinsToDb(championData: ChampionData) {
  try {
    console.log(`'${championData.name}' 챔피언의 스킨 정보 저장 시작...`);

    // 챔피언의 모든 스킨 정보 매핑
    const skinData: SkinInsertData[] = championData.skins.map((skin) => ({
      champion_id: championData.id,
      champion_name: championData.name,
      skin_id: skin.id,
      skin_num: skin.num,
      skin_name: skin.name,
      splash_image_url:
        process.env.NEXT_PUBLIC_LOL_API_URL +
        "/" +
        LOL_API_ENDPOINT.championSplashImage(championData.id, skin.num),
      loading_image_url:
        process.env.NEXT_PUBLIC_LOL_API_URL +
        "/" +
        LOL_API_ENDPOINT.championLoadingImage(championData.id, skin.num),
      square_image_url:
        process.env.NEXT_PUBLIC_LOL_API_URL +
        "/" +
        LOL_API_ENDPOINT.championSquareImage(championData.id),
      has_chromas: skin.chromas,
      version: VERSION,
    }));

    // upsert 방식으로 저장 (중복 방지 및 업데이트)
    const { error } = await adminSupabase
      .schema("lol")
      .from("champion_skins")
      .upsert(skinData, {
        onConflict: "champion_id,skin_id",
        ignoreDuplicates: false, // 중복 시 업데이트
      });

    if (error) {
      console.error(`스킨 데이터 저장 오류:`, error);
      return false;
    }

    // 더 이상 존재하지 않는 스킨 삭제
    const existingSkinIds = championData.skins.map((skin) => skin.id);
    if (existingSkinIds.length > 0) {
      const { error: deleteError } = await adminSupabase
        .schema("lol")
        .from("champion_skins")
        .delete()
        .eq("champion_id", championData.id)
        .not("skin_id", "in", `(${existingSkinIds.join(",")})`);

      if (deleteError) {
        console.warn(`오래된 스킨 데이터 삭제 오류:`, deleteError);
      }
    }

    console.log(
      `'${championData.name}'의 ${skinData.length}개 스킨 정보 저장 완료`
    );
    return true;
  } catch (error) {
    console.error(`'${championData.name}' 스킨 저장 중 예외 발생:`, error);
    return false;
  }
}
