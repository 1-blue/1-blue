"use client";

import { Button } from "@1-blue/ui/components/button";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

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
    <main className="flex min-h-svh items-center justify-center flex-col bg-gradient-to-b from-background to-muted/50 text-foreground p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          리그 오브 레전드 스킨 퀴즈
        </h1>
        <p className="text-muted-foreground">
          챔피언 스킨 이미지를 보고 이름을 맞혀보세요!
        </p>
      </div>

      <div className="w-full max-w-md space-y-4">
        <Button
          className="w-full text-lg py-6"
          onClick={() => handleStartQuiz("multiple-choice")}
        >
          객관식 퀴즈 시작하기
        </Button>

        <Button
          variant="outline"
          className="w-full text-lg py-6"
          onClick={() => handleStartQuiz("short-answer")}
        >
          주관식 퀴즈 시작하기
        </Button>

        <Link href="/how-to-play" className="block w-full">
          <Button variant="outline" className="w-full">
            게임 방법 알아보기
          </Button>
        </Link>
      </div>
    </main>
  );
}
