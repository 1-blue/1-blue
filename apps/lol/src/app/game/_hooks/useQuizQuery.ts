import { useMemo } from "react";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";

import useSupabaseBrowser from "#src/supabase/supabasae-browser";
import { Database } from "#src/supabase/types/database";

export interface IQuiz {
  id: string;
  splashImageUrl: string;
  loadingImageUrl: string;
  championName: string;
  skinName: string;
  correctAnswer: string;
  options: string[];
  type: Database["lol"]["Enums"]["quiz_type_enum"];
}
export interface IQuizOption {
  id: number;
  champion_name: string;
  skin_name: string;
  splash_image_url: string;
}

export const useQuizQuery = (
  count: number,
  type: "multiple-choice" | "short-answer"
) => {
  const supabase = useSupabaseBrowser();

  const { data, error, isLoading } = useQuery(
    supabase
      .schema("lol")
      .from("champion_skins")
      .select(
        "id, champion_name, skin_name, splash_image_url, loading_image_url"
      )
      .neq("skin_num", 0)
  );

  const quizzes = useMemo(() => {
    if (error || !data || data.length === 0) {
      console.error("스킨 데이터 가져오기 오류:", error);
      return [];
    }

    // 클라이언트 측에서 랜덤하게 섞기
    const shuffledSkins = [...data].sort(() => Math.random() - 0.5);
    const quizSkins = shuffledSkins.slice(0, count);

    // 객관식 퀴즈의 경우 선택지로 사용할 데이터 준비
    let remainingSkins: IQuizOption[] = [];

    if (type === "multiple-choice") {
      // 정답이 아닌 스킨들을 선택지로 사용
      remainingSkins = shuffledSkins
        .filter(
          (skin) => !quizSkins.some((quizSkin) => quizSkin.id === skin.id)
        )
        .slice(0, count * 4); // 각 문제당 최대 4개 선택지
    }

    // 퀴즈 생성
    const quizzes: IQuiz[] = quizSkins.map((skin, index) => {
      const skinName = skin.skin_name;

      // 객관식 선택지 생성
      let options: string[] = [];

      if (type === "multiple-choice") {
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
        splashImageUrl: skin.splash_image_url,
        loadingImageUrl: skin.loading_image_url,
        championName: skin.champion_name,
        skinName,
        correctAnswer: skinName,
        options,
        type,
      };
    });

    return quizzes;
  }, [data, error, type, count]);

  return { data: quizzes, error, isLoading };
};
