import { adminSupabase } from "#src/apis";

// 퀴즈 타입 정의
export type Quiz = {
  id: string;
  skinImageUrl: string;
  championName: string;
  skinName: string;
  correctAnswer: string;
  options: string[];
  quizType: "multiple-choice" | "short-answer";
};

/**
 * 퀴즈 데이터 생성 함수
 * @param count 생성할 퀴즈 수
 * @param quizType 퀴즈 유형 (객관식 또는 주관식)
 */
export async function generateQuizzes(
  count: number,
  quizType: "multiple-choice" | "short-answer" = "multiple-choice"
): Promise<Quiz[]> {
  try {
    // 스킨 데이터를 가져온 후 클라이언트 측에서 랜덤하게 섞기
    const { data, error } = await adminSupabase
      .schema("lol")
      .from("champion_skins")
      .select(
        `
        id,
        champion_name,
        skin_name,
        splash_image_url
      `
      )
      .neq("skin_num", 0); // 기본 스킨 제외

    if (error || !data || data.length === 0) {
      console.error("스킨 데이터 가져오기 오류:", error);
      return [];
    }

    // 클라이언트 측에서 랜덤하게 섞기
    const shuffledSkins = [...data].sort(() => Math.random() - 0.5);
    const quizSkins = shuffledSkins.slice(0, count);

    // 객관식 퀴즈의 경우 선택지로 사용할 데이터 준비
    let remainingSkins: any[] = [];

    if (quizType === "multiple-choice") {
      // 정답이 아닌 스킨들을 선택지로 사용
      remainingSkins = shuffledSkins
        .filter(
          (skin) => !quizSkins.some((quizSkin) => quizSkin.id === skin.id)
        )
        .slice(0, count * 4); // 각 문제당 최대 4개 선택지
    }

    // 퀴즈 생성
    const quizzes: Quiz[] = quizSkins.map((skin, index) => {
      const skinName = skin.skin_name;
      const championName = skin.champion_name;

      // 객관식 선택지 생성
      let options: string[] = [];

      if (quizType === "multiple-choice") {
        // 현재 퀴즈를 위한 추가 선택지 4개 선택
        const startIdx = index * 4;
        const otherOptions = remainingSkins
          .slice(startIdx, Math.min(startIdx + 4, remainingSkins.length))
          .map((s) => s.skin_name);

        // 최종 선택지 (정답 + 추가 선택지)를 랜덤하게 섞기
        options = [skinName, ...otherOptions].sort(() => Math.random() - 0.5);
      } else {
        // 주관식의 경우 빈 배열 (UI에서는 입력 필드 사용)
        options = [];
      }

      return {
        id: skin.id.toString(),
        skinImageUrl: skin.splash_image_url,
        championName,
        skinName,
        correctAnswer: skinName,
        options,
        quizType,
      };
    });

    return quizzes;
  } catch (error) {
    console.error("퀴즈 생성 오류:", error);
    return [];
  }
}
