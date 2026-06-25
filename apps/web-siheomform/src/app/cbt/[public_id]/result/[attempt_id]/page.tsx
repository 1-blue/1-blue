"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@1-blue/ui/components/button";
import { toast } from "sonner";
import { CommentsSection } from "@/app/_components/CommentsSection";
import { LikeButton } from "@/app/_components/LikeButton";
import { PageShell } from "@/app/_components/PageShell";
import { QuestionReviewCard } from "@/app/cbt/[public_id]/result/_components/QuestionReviewCard";
import { ResultShareCard } from "@/app/cbt/[public_id]/result/_components/ResultShareCard";

type ResultData = {
  title: string;
  nickname: string;
  score: number;
  totalQuestions: number;
  passingScore: number;
  passed: boolean;
  showExplanation: boolean;
  isPublic: boolean;
  submittedAt: string | null;
  questions: Array<{
    id: string;
    orderIndex: number;
    content: string;
    imageUrl: string | null;
    choices: Array<{ id: string; content: string }>;
    correctChoiceId: string;
    explanation: string | null;
    explanationImageUrl: string | null;
  }>;
  answers: Array<{
    questionId: string;
    selectedChoiceId: string | null;
    isCorrect: boolean | null;
  }>;
};

const ResultPageClient = () => {
  const params = useParams<{ public_id: string; attempt_id: string }>();
  const [result, setResult] = useState<ResultData | null>(null);
  const [notSubmitted, setNotSubmitted] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [likeCount, setLikeCount] = useState(0);
  const [likedByMe, setLikedByMe] = useState(false);
  const [savingImage, setSavingImage] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      const response = await fetch(`/api/cbts/${params.public_id}/attempts/${params.attempt_id}`);
      if (response.status === 403) {
        setNotSubmitted(true);
        return;
      }
      if (response.ok) {
        setResult((await response.json()) as ResultData);
      }
      const likeRes = await fetch(
        `/api/cbts/${params.public_id}/likes?attemptId=${encodeURIComponent(params.attempt_id)}`,
      );
      if (likeRes.ok) {
        const data = (await likeRes.json()) as { likeCount: number; likedByMe: boolean };
        setLikeCount(data.likeCount);
        setLikedByMe(data.likedByMe);
      }
    };
    void load();
  }, [params.public_id, params.attempt_id]);

  const toggleLike = async () => {
    const response = await fetch(`/api/cbts/${params.public_id}/likes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attemptId: params.attempt_id }),
    });
    if (response.ok) {
      const data = (await response.json()) as { liked: boolean; likeCount: number };
      setLikedByMe(data.liked);
      setLikeCount(data.likeCount);
    }
  };

  const handleSaveImage = async () => {
    if (!shareRef.current || !result) {
      return;
    }
    setSavingImage(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(shareRef.current, {
        backgroundColor: "#111827",
        scale: 2,
      });
      const link = document.createElement("a");
      link.download = "siheomform-result.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      toast.error("이미지 저장에 실패했습니다.");
    } finally {
      setSavingImage(false);
    }
  };

  if (notSubmitted) {
    return (
      <PageShell wide>
        <div className="mx-auto mt-12 max-w-lg space-y-4 text-center">
          <p className="text-lg font-semibold">아직 제출하지 않은 응시입니다</p>
          <p className="text-muted-foreground text-sm">
            시험을 제출해야 결과를 확인할 수 있습니다. 이어서 풀거나 처음부터 다시 응시해 주세요.
          </p>
          <Button asChild className="w-full">
            <Link href={`/cbt/${params.public_id}/take`}>시험 이어 풀기</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href={`/cbt/${params.public_id}`}>시험 소개로</Link>
          </Button>
        </div>
      </PageShell>
    );
  }

  if (!result) {
    return (
      <PageShell>
        <p className="text-muted-foreground mt-8 text-center text-sm">불러오는 중…</p>
      </PageShell>
    );
  }

  const correctCount = result.answers.filter((a) => a.isCorrect).length;

  return (
    <PageShell wide>
      <div className="mx-auto mt-6 max-w-lg space-y-6">
        <div className="text-center">
          <span
            className={`rounded px-2 py-0.5 text-xs font-bold ${result.passed ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
          >
            {result.passed ? "합격" : "불합격"}
          </span>
          <p className="mt-2 text-4xl font-bold">{result.score}점</p>
          <p className="text-muted-foreground text-sm">
            정답 {correctCount}/{result.totalQuestions}
          </p>
        </div>

        <div className="surface-card rounded-xl p-5">
          <p className="text-muted-foreground text-xs">{new Date().toLocaleDateString("ko-KR")}</p>
          <p className="mt-2 font-semibold">{result.title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{result.nickname}</p>
          <p className="mt-4 text-3xl font-bold">
            {result.score} / 100
            <span className={`ml-2 text-sm ${result.passed ? "text-emerald-600" : "text-red-600"}`}>
              {result.passed ? "PASS" : "FAIL"}
            </span>
          </p>
        </div>

        <div className="pointer-events-none fixed -left-[9999px] top-0" aria-hidden>
          <ResultShareCard
            ref={shareRef}
            title={result.title}
            score={result.score}
            passed={result.passed}
            correctCount={correctCount}
            totalQuestions={result.totalQuestions}
            nickname={result.nickname}
          />
        </div>

        <Button className="w-full" disabled={savingImage} onClick={() => void handleSaveImage()}>
          {savingImage ? "저장 중…" : "결과 이미지 저장"}
        </Button>

        {result.isPublic && (
          <div className="flex justify-center">
            <LikeButton
              liked={likedByMe}
              count={likeCount}
              onToggle={() => void toggleLike()}
              size="md"
            />
          </div>
        )}

        <div className="space-y-3">
          <h2 className="font-semibold">문항 리뷰</h2>
          {result.questions.map((question) => {
            const answer = result.answers.find((a) => a.questionId === question.id);
            return (
              <QuestionReviewCard
                key={question.id}
                orderIndex={question.orderIndex}
                content={question.content}
                choices={question.choices}
                correctChoiceId={question.correctChoiceId}
                selectedChoiceId={answer?.selectedChoiceId}
                isCorrect={answer?.isCorrect}
                explanation={question.explanation}
                showExplanation={result.showExplanation}
                isOpen={Boolean(expanded[question.id])}
                onToggle={() =>
                  setExpanded((prev) => ({ ...prev, [question.id]: !prev[question.id] }))
                }
              />
            );
          })}
        </div>

        <Button asChild variant="outline" className="w-full">
          <Link href={`/cbt/${params.public_id}`}>다시 응시하기</Link>
        </Button>

        {result.isPublic && result.submittedAt && (
          <CommentsSection
            publicId={params.public_id}
            attemptId={params.attempt_id}
            canInteract
            showCompose
          />
        )}
      </div>
    </PageShell>
  );
};

export default ResultPageClient;
