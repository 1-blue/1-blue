"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatKstDateShort } from "@1-blue/core/daily-doodle";
import { StitchPageShell } from "@/app/_components/stitch/StitchPageShell";
import type { ArchiveListItem } from "@/lib/types";

export const ArchiveListPage = () => {
  const [archives, setArchives] = useState<ArchiveListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch("/api/archive");
        const data = (await response.json()) as { archives: ArchiveListItem[] };
        setArchives(data.archives ?? []);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  return (
    <StitchPageShell headerLabel="오늘의 낙서" showHomeLink>
      <section className="space-y-4 py-4">
        <h1 className="text-ink text-center text-2xl font-bold">지난 낙서</h1>

        {loading && <p className="text-ink/60 text-center text-sm">불러오는 중...</p>}

        {!loading && archives.length === 0 && (
          <p className="text-ink/60 paper-surface rounded-xl border border-[#e8dfc8] p-8 text-center text-sm">
            아직 아카이브가 없어요
          </p>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          {archives.map((archive) => (
            <Link
              key={archive.boardDate}
              href={`/archive/${archive.boardDate}`}
              className="paper-surface hover:border-accent/40 rounded-xl border border-[#e8dfc8] p-4 shadow-sm transition-colors"
            >
              <div className="bg-paper mb-3 aspect-[3/2] rounded-lg border border-[#e8dfc8]" />
              <h2 className="text-ink text-sm font-bold">{formatKstDateShort(archive.boardDate)}</h2>
              <p className="text-ink/60 mt-1 text-xs">{archive.strokeCount}개의 획</p>
            </Link>
          ))}
        </div>
      </section>
    </StitchPageShell>
  );
};
