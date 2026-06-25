"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@1-blue/ui/components/button";
import { AdSensePlaceholder } from "@/app/_components/AdSensePlaceholder";
import { FaqSection } from "@/app/_components/FaqSection";
import { MetaChips } from "@/app/_components/MetaChips";
import { PageShell } from "@/app/_components/PageShell";
import { StatusBadge } from "@/app/_components/StatusBadge";
import { getMyCbts, type MyCbtEntry } from "@/app/_hooks/useMyCbts";

type PublicCbtSummary = {
  publicId: string;
  title: string;
  questionCount: number;
  timeLimitMinutes: number | null;
  passingScore: number;
  attemptCount: number;
  likeCount: number;
};

type SortKey = "popular" | "likes" | "recent";

export const HomePage = () => {
  const [myCbts, setMyCbts] = useState<MyCbtEntry[]>([]);
  const [publicCbts, setPublicCbts] = useState<PublicCbtSummary[]>([]);
  const [sort, setSort] = useState<SortKey>("popular");

  useEffect(() => {
    setMyCbts(getMyCbts());
  }, []);

  useEffect(() => {
    const load = async () => {
      const response = await fetch(`/api/cbts/public?sort=${sort}`);
      if (response.ok) {
        const data = (await response.json()) as { items: PublicCbtSummary[] };
        setPublicCbts(data.items);
      }
    };
    void load();
  }, [sort]);

  return (
    <PageShell wide>
      <section className="mt-8 text-center">
        <span className="bg-primary/10 text-primary inline-block rounded-full px-3 py-1 text-xs font-semibold">
          로그인 없이 CBT 만들고 링크로 공유
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          누구나 쉽게 만드는 <span className="text-primary">온라인 시험</span>
        </h1>
        <p className="text-muted-foreground mx-auto mt-3 max-w-2xl text-sm">
          복잡한 설정 없이 문제를 구성하고 URL로 공유하세요. 자동 채점과 통계까지 한 번에.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/create">+ 새 CBT 만들기</Link>
          </Button>
        </div>
      </section>

      <div className="mt-8">
        <AdSensePlaceholder slotId="landing-hero" />
      </div>

      {myCbts.length > 0 && (
        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">내가 만든 CBT</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {myCbts.slice(0, 4).map((cbt) => (
              <Link
                key={cbt.adminToken}
                href={`/manage/${cbt.adminToken}`}
                className="surface-card block p-4 transition hover:shadow-md"
              >
                <div className="mb-2 flex items-center gap-2">
                  <StatusBadge status="active" />
                  <span className="bg-primary/10 text-primary rounded px-2 py-0.5 text-xs font-semibold">
                    {cbt.questionCount}문항
                  </span>
                </div>
                <p className="font-semibold">{cbt.title}</p>
                <p className="text-muted-foreground mt-1 text-xs">
                  최종 수정: {new Date(cbt.updatedAt).toLocaleString("ko-KR")}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-bold">공개 CBT</h2>
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              type="button"
              className={sort === "popular" ? "text-primary font-semibold" : "text-muted-foreground"}
              onClick={() => setSort("popular")}
            >
              인기순
            </button>
            <span className="text-muted-foreground">|</span>
            <button
              type="button"
              className={sort === "likes" ? "text-primary font-semibold" : "text-muted-foreground"}
              onClick={() => setSort("likes")}
            >
              추천순
            </button>
            <span className="text-muted-foreground">|</span>
            <button
              type="button"
              className={sort === "recent" ? "text-primary font-semibold" : "text-muted-foreground"}
              onClick={() => setSort("recent")}
            >
              최신순
            </button>
          </div>
        </div>
        <div className="surface-card divide-border divide-y">
          {publicCbts.length === 0 ? (
            <p className="text-muted-foreground p-6 text-center text-sm">아직 공개된 CBT가 없습니다.</p>
          ) : (
            publicCbts.map((cbt) => (
              <Link
                key={cbt.publicId}
                href={`/cbt/${cbt.publicId}`}
                className="flex flex-col gap-2 p-4 hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 space-y-1.5">
                  <p className="font-medium">{cbt.title}</p>
                  <MetaChips
                    questionCount={cbt.questionCount}
                    timeLimitMinutes={cbt.timeLimitMinutes}
                    passingScore={cbt.passingScore}
                  />
                </div>
                <div className="text-muted-foreground flex shrink-0 gap-3 text-xs">
                  <span>좋아요 {cbt.likeCount}</span>
                  <span>응시 {cbt.attemptCount}명</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      <FaqSection />
    </PageShell>
  );
};
