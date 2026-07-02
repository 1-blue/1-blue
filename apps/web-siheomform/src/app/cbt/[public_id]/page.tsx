"use client";

import { ROUTES } from "@/app/_constants/routes";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@1-blue/ui/components/button";
import { Input } from "@1-blue/ui/components/input";
import { Label } from "@1-blue/ui/components/label";
import { AdSensePlaceholder } from "@/app/_components/AdSensePlaceholder";
import { CommentsSection } from "@/app/cbt/[public_id]/_components/CommentsSection";
import { LikeButton } from "@/app/cbt/[public_id]/_components/LikeButton";
import { MetaChips } from "@/app/_components/MetaChips";
import { PageShell } from "@/app/_components/PageShell";

type PublicCbt = {
  publicId: string;
  metadata: {
    title: string;
    description: string | null;
    coverImageUrl: string | null;
    timeLimitMinutes: number | null;
    passingScore: number;
    isPublic: boolean;
  };
  questions: unknown[];
};

const CbtIntroPageClient = () => {
  const params = useParams<{ public_id: string }>();
  const router = useRouter();
  const [cbt, setCbt] = useState<PublicCbt | null>(null);
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likedByMe, setLikedByMe] = useState(false);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [canInteract, setCanInteract] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(`siheomform:attempt:${params.public_id}`);
    setAttemptId(stored);
  }, [params.public_id]);

  useEffect(() => {
    const load = async () => {
      const response = await fetch(`/api/cbts/${params.public_id}`);
      if (response.ok) {
        setCbt((await response.json()) as PublicCbt);
      }
      const likeQs = attemptId ? `?attemptId=${encodeURIComponent(attemptId)}` : "";
      const likeRes = await fetch(`/api/cbts/${params.public_id}/likes${likeQs}`);
      if (likeRes.ok) {
        const data = (await likeRes.json()) as { likeCount: number; likedByMe: boolean };
        setLikeCount(data.likeCount);
        setLikedByMe(data.likedByMe);
      }
      if (attemptId) {
        const attemptRes = await fetch(`/api/cbts/${params.public_id}/attempts/${attemptId}`);
        if (attemptRes.ok) {
          const attempt = (await attemptRes.json()) as { submittedAt: string | null };
          setCanInteract(Boolean(attempt.submittedAt));
        }
      }
    };
    void load();
  }, [params.public_id, attemptId]);

  const handleStart = async () => {
    if (!nickname.trim()) {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`/api/cbts/${params.public_id}/attempts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: nickname.trim() }),
      });
      const data = (await response.json()) as {
        attemptId?: string;
        displayNickname?: string;
        error?: string;
      };
      if (!response.ok || !data.attemptId) {
        throw new Error(data.error ?? "시작에 실패했습니다");
      }
      sessionStorage.setItem(`siheomform:attempt:${params.public_id}`, data.attemptId);
      router.push(ROUTES.CBT.DETAIL.TAKE.path(params.public_id));
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async () => {
    if (!attemptId || !canInteract) {
      return;
    }
    const response = await fetch(`/api/cbts/${params.public_id}/likes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attemptId }),
    });
    if (response.ok) {
      const data = (await response.json()) as { liked: boolean; likeCount: number };
      setLikedByMe(data.liked);
      setLikeCount(data.likeCount);
    }
  };

  if (!cbt) {
    return (
      <PageShell>
        <p className="text-muted-foreground mt-8 text-center text-sm">불러오는 중…</p>
      </PageShell>
    );
  }

  return (
    <PageShell wide>
      <div className="mx-auto mt-6 max-w-lg space-y-6 md:max-w-2xl">
        {cbt.metadata.coverImageUrl && (
          <img
            src={cbt.metadata.coverImageUrl}
            alt=""
            className="h-40 w-full rounded-xl object-cover"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold">{cbt.metadata.title}</h1>
          {cbt.metadata.description && (
            <p className="text-muted-foreground mt-2 text-sm">{cbt.metadata.description}</p>
          )}
        </div>
        <MetaChips
          questionCount={cbt.questions.length}
          timeLimitMinutes={cbt.metadata.timeLimitMinutes}
          passingScore={cbt.metadata.passingScore}
        />
        <AdSensePlaceholder slotId="exam-intro-top" />
        {cbt.metadata.isPublic && (
          <LikeButton
            liked={likedByMe}
            count={likeCount}
            disabled={!canInteract}
            onToggle={() => void toggleLike()}
            size="md"
          />
        )}
        <div className="surface-card space-y-3 p-4">
          <Label htmlFor="nickname">닉네임</Label>
          <Input
            id="nickname"
            placeholder="닉네임을 입력하세요"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <Button
            className="w-full"
            onClick={() => void handleStart()}
            disabled={loading || !nickname.trim()}
          >
            시험 시작 →
          </Button>
        </div>
        <p className="text-muted-foreground text-center text-xs">제출 후 결과를 확인할 수 있어요</p>
        {cbt.metadata.isPublic && (
          <CommentsSection
            publicId={params.public_id}
            attemptId={attemptId}
            canInteract={canInteract}
          />
        )}
        <Button asChild variant="link" className="w-full">
          <Link href={ROUTES.HOME.path}>홈으로</Link>
        </Button>
      </div>
    </PageShell>
  );
};

export default CbtIntroPageClient;
