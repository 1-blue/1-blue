import { saveChampionSkinsToDb } from "#src/libs/db/skins";
import { saveChampionToDB } from "#src/libs/db/champions";
import { getChampionByName } from "#src/apis";

/**
 * 특정 챔피언 정보를 가져오고 DB에 저장하는 API 라우트 핸들러
 */
export async function GET(
  request: Request,
  { params }: { params: { name: string } }
) {
  try {
    // URL 파라미터에서 챔피언 이름 추출
    const { name } = params;
    console.log(`'${name}' 챔피언 정보 요청 처리 중...`);

    // Riot API에서 챔피언 정보 가져오기
    const championResponse = await getChampionByName(name);

    // 챔피언 데이터 추출
    const championData = Object.values(championResponse.data)[0];

    // DB에 챔피언 기본 정보 저장
    await saveChampionToDB(championData);

    // DB에 스킨 정보 저장
    const saveResult = await saveChampionSkinsToDb(championData);

    // API 응답 반환
    return Response.json({
      champion: championData,
      dbSaveStatus: saveResult ? "success" : "failed",
    });
  } catch (error) {
    console.error("챔피언 정보 처리 중 오류:", error);
    return Response.json(
      {
        error: "챔피언 정보를 가져오는 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
