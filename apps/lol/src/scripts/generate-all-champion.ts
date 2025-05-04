// 파일 최상단에 추가
import "dotenv/config";

import { LOCALE, VERSION } from "#src/constants";
import { saveChampionSkinsToDb } from "#src/libs/db/skins";
import { saveChampionToDB } from "#src/libs/db/champions";
import { getAllChampions, getChampionByName } from "#src/apis";

/**
 * 모든 챔피언 정보를 수집하여 DB에 저장하는 함수
 */
const generateAllChampion = async () => {
  try {
    console.log(
      `리그 오브 레전드 데이터 수집 시작 (버전: ${VERSION}, 언어: ${LOCALE})`
    );

    // 모든 챔피언 목록 가져오기
    const championsListResponse = await getAllChampions();

    const championIds = Object.values(championsListResponse.data).map(
      (champion) => champion.id
    );
    console.log(`총 ${championIds.length}개 챔피언 정보 수집 예정`);

    let successCount = 0;
    let failCount = 0;

    // 각 챔피언마다 상세 정보 가져와서 저장
    for (const championId of championIds) {
      try {
        console.log(`${championId} 처리 중...`);

        // 해당 챔피언 상세 정보 가져오기
        const championResponse = await getChampionByName(championId);

        // 챔피언 데이터 추출
        const championData = Object.values(championResponse.data)[0];

        // 챔피언 기본 정보 저장
        const championSaveResult = await saveChampionToDB(championData);

        // 스킨 정보 저장
        const skinSaveResult = await saveChampionSkinsToDb(championData);

        if (championSaveResult && skinSaveResult) {
          console.log(`✅ ${championId} 정보 저장 완료`);
          successCount++;
        } else {
          console.warn(`⚠️ ${championId} 정보 일부 저장 실패`);
          failCount++;
        }

        // API 호출 간격 조절
        await new Promise((resolve) => setTimeout(resolve, 300));
      } catch (championError) {
        console.error(`${championId} 처리 중 오류:`, championError);
        failCount++;
      }
    }

    console.log(`
데이터 수집 작업 완료!
✅ 성공: ${successCount}개 챔피언
❌ 실패: ${failCount}개 챔피언
    `);
  } catch (error) {
    console.error("데이터 수집 중 오류:", error);
  }
};

// 스크립트 실행
generateAllChampion();
