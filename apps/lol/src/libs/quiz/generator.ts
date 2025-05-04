// src/lib/quiz/generator.ts
import { supabase } from "#src/apis";

/**
 * 스킨 퀴즈 문제 타입
 */
export interface SkinQuiz {
  id: string;
  question: string;
  imageUrl: string;
  correctAnswer: string;
  skinName: string;
  options: string[];
}

/**
 * 랜덤 스킨 퀴즈 문제 생성
 * @returns 퀴즈 문제 객체
 */
export async function getRandomSkinQuiz(): Promise<SkinQuiz | null> {
  try {
    // 랜덤으로 스킨 데이터 가져오기
    const { data, error } = await supabase
      .schema("lol")
      .from("champion_skins")
      .select("*")
      .neq("skin_num", 0) // 기본 스킨 제외
      .order("id", { ascending: false, nullsFirst: false }) // 임의의 필드로 정렬
      .limit(1);

    if (error || !data || data.length === 0) {
      console.error("퀴즈 데이터 가져오기 오류:", error);
      return null;
    }

    const skinData = data[0];

    // 오답 옵션 가져오기
    const { data: wrongOptions, error: wrongError } = await supabase
      .schema("lol")
      .from("champion_skins")
      .select("champion_name")
      .neq("champion_id", skinData.champion_id) // 정답 챔피언 제외
      .order("id", { ascending: false, nullsFirst: false }) // 임의의 필드로 정렬
      .limit(3);

    if (wrongError || !wrongOptions) {
      console.error("오답 데이터 가져오기 오류:", wrongError);
      return null;
    }

    // 중복 제거 (같은 챔피언 이름이 있을 경우)
    const uniqueWrongOptions = Array.from(
      new Set(wrongOptions.map((option) => option.champion_name))
    );

    // 안전 장치: 최대 시도 횟수
    let attempts = 0;
    const MAX_ATTEMPTS = 3;

    // 부족한 오답 채우기
    while (uniqueWrongOptions.length < 3 && attempts < MAX_ATTEMPTS) {
      attempts++;
      console.log(`오답 채우기 시도 ${attempts}/${MAX_ATTEMPTS}`);

      // 이전 쿼리보다 더 많은 데이터 요청
      const { data: fallbackOptions, error: fallbackError } = await supabase
        .schema("lol")
        .from("champion_skins")
        .select("champion_name")
        .neq("champion_id", skinData.champion_id)
        .limit(20); // 더 많은 데이터 요청

      if (fallbackError) {
        console.error("fallback 오답 가져오기 오류:", fallbackError);
        break; // 오류 발생 시 루프 종료
      }

      if (!fallbackOptions || fallbackOptions.length === 0) {
        console.log("추가 오답 후보가 없습니다");
        break; // 데이터가 없으면 루프 종료
      }

      // 중복 제거하여 추가
      for (const option of fallbackOptions) {
        if (
          !uniqueWrongOptions.includes(option.champion_name) &&
          option.champion_name !== skinData.champion_name
        ) {
          uniqueWrongOptions.push(option.champion_name);
          console.log(`오답 추가: ${option.champion_name}`);
          if (uniqueWrongOptions.length >= 3) break;
        }
      }
    }

    // 충분한 오답을 얻지 못한 경우 처리
    if (uniqueWrongOptions.length < 3) {
      console.log(`충분한 오답을 얻지 못했습니다. 임의의 오답으로 채웁니다.`);

      // 임의의 오답으로 채우기
      const dummyOptions = ["가상 챔피언 1", "가상 챔피언 2", "가상 챔피언 3"];

      for (let i = 0; uniqueWrongOptions.length < 3; i++) {
        const dummyOption = dummyOptions[i % dummyOptions.length];
        if (!uniqueWrongOptions.includes(dummyOption)) {
          uniqueWrongOptions.push(dummyOption);
        }
      }
    }

    // 문제 구성하기
    const quiz: SkinQuiz = {
      id: `skin-${skinData.id}`,
      question: "이 스킨은 어떤 챔피언의 스킨인가요?",
      imageUrl: skinData.image_url,
      correctAnswer: skinData.champion_name,
      skinName: skinData.skin_name,
      options: [
        skinData.champion_name, // 정답
        ...uniqueWrongOptions, // 오답 3개
      ].sort(() => Math.random() - 0.5), // 선택지 섞기
    };

    return quiz;
  } catch (error) {
    console.error("퀴즈 생성 중 오류:", error);
    return null;
  }
}
