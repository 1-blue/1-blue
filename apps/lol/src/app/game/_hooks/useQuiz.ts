import { useMemo } from "react";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { Database, getSupabaseFromAnnoRole } from "@1-blue/supabase";

// shuffleArray 유틸리티 함수를 useMemo 외부로 이동
const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

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

export const useQuiz = (
  count: number,
  type: "multiple-choice" | "short-answer"
) => {
  const supabase = getSupabaseFromAnnoRole();

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

    const shuffledSkins = shuffleArray([...data]); // 원본 데이터를 변경하지 않도록 복사 후 셔플
    const quizSkins = shuffledSkins.slice(0, count);

    let optionsCandidatePool: IQuizOption[] = [];
    if (type === "multiple-choice") {
      optionsCandidatePool = shuffledSkins.filter(
        (s) => !quizSkins.some((quizSkin) => quizSkin.id === s.id)
      );
    }

    const generatedQuizzes: IQuiz[] = quizSkins.map((currentCorrectSkin) => {
      const currentSkinName = currentCorrectSkin.skin_name;
      const currentChampionName = currentCorrectSkin.champion_name;
      let options: string[] = [];

      if (type === "multiple-choice") {
        // 1. 오답 후보군 준비 (현재 정답 스킨은 이미 optionsCandidatePool에서 제외됨)
        const sameChampionWrongAnswers = optionsCandidatePool
          .filter((s) => s.champion_name === currentChampionName)
          .map((s) => s.skin_name);

        const diffChampionWrongAnswers = optionsCandidatePool
          .filter((s) => s.champion_name !== currentChampionName)
          .map((s) => s.skin_name);

        const shuffledSameChamp = shuffleArray(sameChampionWrongAnswers);
        const shuffledDiffChamp = shuffleArray(diffChampionWrongAnswers);

        let wrongOptions: string[] = [];

        // 2. 동일 챔피언 오답에서 최소 2개 (또는 가능한 만큼) 선택
        const takeFromSame = Math.min(2, shuffledSameChamp.length);
        wrongOptions.push(...shuffledSameChamp.slice(0, takeFromSame));

        // 3. 필요한 만큼 (총 4개 오답 목표) 다른 챔피언 오답에서 선택
        const neededFromDiff = 4 - wrongOptions.length;
        if (neededFromDiff > 0) {
          wrongOptions.push(...shuffledDiffChamp.slice(0, neededFromDiff));
        }

        // 4. 그래도 4개 오답이 안되면, 동일 챔피언 남은 것에서 채우기
        if (wrongOptions.length < 4) {
          const stillNeeded = 4 - wrongOptions.length;
          if (stillNeeded > 0 && shuffledSameChamp.length > takeFromSame) {
            wrongOptions.push(
              ...shuffledSameChamp.slice(
                takeFromSame,
                takeFromSame + stillNeeded
              )
            );
          }
        }

        // 중복 제거 (만약을 위해)
        wrongOptions = Array.from(new Set(wrongOptions));

        // 5. 정답과 오답 합치기 (최대 4개의 오답 + 1개의 정답 = 최대 5개)
        const finalOptionList = [currentSkinName, ...wrongOptions.slice(0, 4)];

        // 6. 최종 선택지 개수가 5개 미만이면, 전체 오답 후보군에서 더 채우기
        if (finalOptionList.length < 5) {
          const moreNeeded = 5 - finalOptionList.length;
          const additionalOptions = optionsCandidatePool
            .filter((s) => !finalOptionList.includes(s.skin_name))
            .map((s) => s.skin_name);
          finalOptionList.push(
            ...shuffleArray(additionalOptions).slice(0, moreNeeded)
          );
        }

        options = shuffleArray(Array.from(new Set(finalOptionList))).slice(
          0,
          5
        );

        // 7. 최종 선택지에 정답이 포함되었는지 확인하고, 없다면 (그리고 5개라면) 하나를 교체
        if (options.length === 5 && !options.includes(currentSkinName)) {
          options[Math.floor(Math.random() * 5)] = currentSkinName;
          options = shuffleArray(options); // 교체 후 다시 셔플
        } else if (options.length < 5 && !options.includes(currentSkinName)) {
          // 자리가 있고 정답이 없다면 추가 후 셔플 (이 경우는 거의 없음)
          options.push(currentSkinName);
          options = shuffleArray(options);
        }
        // 만약 5개 미만인데 정답이 이미 있다면 그대로 둠.
      } else {
        // 주관식의 경우 빈 배열
        options = [];
      }

      return {
        id: currentCorrectSkin.id.toString(),
        splashImageUrl: currentCorrectSkin.splash_image_url,
        loadingImageUrl: currentCorrectSkin.loading_image_url,
        championName: currentCorrectSkin.champion_name,
        skinName: currentSkinName,
        correctAnswer: currentSkinName,
        options,
        type,
      };
    });

    return generatedQuizzes;
  }, [data, error, type, count]); // shuffledSkins, quizSkins, optionsCandidatePool 등은 data, count, type에 의해 결정됨

  return { data: quizzes, error, isLoading };
};
