"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { formatKstDateLabel } from "@1-blue/core/daily-doodle";
import { Button } from "@1-blue/ui/components/button";
import { DoodleCanvas, type DoodleCanvasHandle } from "@/app/_components/DoodleCanvas";
import { StitchPageShell } from "@/app/_components/stitch/StitchPageShell";
import type { ArchiveDetailView } from "@/lib/types";

type ArchiveDetailPageProps = {
  boardDate: string;
};

export const ArchiveDetailPage = ({ boardDate }: ArchiveDetailPageProps) => {
  const canvasRef = useRef<DoodleCanvasHandle>(null);
  const [archive, setArchive] = useState<ArchiveDetailView | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(`/api/archive/${boardDate}`);
        const data = (await response.json()) as ArchiveDetailView & { error?: string };

        if (!response.ok) {
          setNotFound(true);
          return;
        }

        setArchive(data);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [boardDate]);

  return (
    <StitchPageShell headerLabel="오늘의 낙서" showHomeLink>
      <section className="space-y-4 py-4">
        <div className="paper-surface rounded-xl border border-[#e8dfc8] px-4 py-2 text-center text-sm font-semibold">
          읽기 전용 · {formatKstDateLabel(boardDate)}
        </div>

        {loading && <div className="canvas-card aspect-[3/2] w-full animate-pulse rounded-2xl" />}

        {notFound && (
          <p className="text-ink/60 text-center text-sm">아카이브를 찾을 수 없어요.</p>
        )}

        {archive && (
          <>
            <DoodleCanvas ref={canvasRef} strokes={archive.strokes} interactive={false} />
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                className="h-11 flex-1"
                onClick={() => canvasRef.current?.exportPng()}
              >
                PNG 저장
              </Button>
              <Button type="button" className="bg-accent hover:bg-accent/90 h-11 flex-1" asChild>
                <Link href="/">오늘 낙서하러 가기</Link>
              </Button>
            </div>
          </>
        )}
      </section>
    </StitchPageShell>
  );
};
