"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@1-blue/ui/components/button";
import RankingTabs from "./_components/RankingTabs";

export default function Home() {
  const queryClient = useQueryClient();
  const router = useRouter();

  // 퀴즈 타입에 따라 라우팅 및 쿼리 무효화
  const handleStartQuiz = (quizType: "multiple-choice" | "short-answer") => {
    // 기존 퀴즈 데이터 캐시 무효화
    queryClient.invalidateQueries({ queryKey: ["quizzes"] });

    // 게임 페이지로 이동
    router.push(`/game?type=${quizType}`);
  };

  return (
    <main className="min-h-screen flex flex-col items-center p-8">
      <section className="text-center mb-10 max-w-3xl">
        <h1 className="text-4xl font-bold mb-3">리그오브레전드 스킨 퀴즈</h1>
        <p className="text-xl text-gray-600 mb-6">
          리그 오브 레전드 챔피언 스킨을 맞춰보세요!
        </p>

        <div className="flex gap-4 justify-center mb-8">
          <Button
            className="text-lg"
            size="lg"
            onClick={() => handleStartQuiz("multiple-choice")}
          >
            객관식 모드 시작
          </Button>

          <Button
            className="text-lg"
            size="lg"
            variant="outline"
            onClick={() => handleStartQuiz("short-answer")}
          >
            주관식 모드 시작
          </Button>
        </div>

        <div className="flex justify-center">
          <Button asChild variant="ghost">
            <Link href="/how-to-play">게임 방법 자세히 알아보기</Link>
          </Button>
        </div>
      </section>

      <section className="mt-6 w-full max-w-3xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">🏆 랭킹</h2>
          <Button asChild variant="outline" size="sm">
            <Link href="/rankings">전체 랭킹 보기</Link>
          </Button>
        </div>

        <RankingTabs />
      </section>
    </main>
  );
}
