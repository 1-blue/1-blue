"use client";

import { ROUTES } from "@/app/_constants/routes";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { formatKstDateShort } from "@/core";
import { Badge } from "@1-blue/ui/components/badge";
import { AdSensePlaceholder } from "@/app/_components/AdSensePlaceholder";
import { StitchPageShell } from "@/app/_components/stitch/StitchPageShell";
import { ThemeBadge } from "@/app/_components/ThemeBadge";
import type { ArchiveAvailability, ArchiveListItem } from "@/lib/types";

const availabilityLabel: Record<ArchiveAvailability, string> = {
  playable: "연습 가능",
  today: "오늘 공개",
  upcoming: "공개 예정",
};

const availabilityBadgeClass: Record<ArchiveAvailability, string> = {
  playable: "border-accent/40 text-accent",
  today: "border-white/20 text-ink-muted",
  upcoming: "border-white/20 text-ink-muted",
};

const toastMessage: Record<Exclude<ArchiveAvailability, "playable">, string> = {
  today: "오늘의 퍼즐은 홈에서 플레이할 수 있습니다.",
  upcoming: "아직 공개되지 않은 세트입니다.",
};

export const ArchiveListPage = () => {
  const [archives, setArchives] = useState<ArchiveListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/archive");
        const data = (await res.json()) as { archives: ArchiveListItem[] };
        setArchives(data.archives ?? []);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const handleUnavailableClick = (availability: Exclude<ArchiveAvailability, "playable">) => {
    toast.info(toastMessage[availability]);
  };

  return (
    <StitchPageShell showHomeLink>
      <section className="space-y-4 py-4">
        <h1 className="text-center text-2xl font-bold">아카이브</h1>
        <p className="text-ink-muted text-center text-sm">
          과거 세트는 연습할 수 있고, 예정된 세트는 미리 확인할 수 있습니다
        </p>

        <AdSensePlaceholder slotId="archive-list-top" />

        {loading && <p className="text-ink-muted text-center text-sm">불러오는 중...</p>}

        {!loading && archives.length === 0 && (
          <p className="surface-card text-ink-muted p-8 text-center text-sm">아카이브가 없습니다</p>
        )}

        <div className="grid gap-3">
          {archives.map((item) => {
            const isPlayable = item.availability === "playable";

            if (isPlayable) {
              return (
                <Link
                  key={item.puzzleDate}
                  href={ROUTES.ARCHIVE.DETAIL.path(item.puzzleDate)}
                  className="surface-card hover:border-accent/40 flex items-center justify-between gap-3 p-4 transition-colors"
                >
                  <ArchiveCardContent item={item} />
                </Link>
              );
            }

            return (
              <button
                key={item.puzzleDate}
                type="button"
                onClick={() => {
                  if (item.availability !== "playable") {
                    handleUnavailableClick(item.availability);
                  }
                }}
                className="surface-card flex w-full cursor-not-allowed items-center justify-between gap-3 p-4 text-left opacity-70"
              >
                <ArchiveCardContent item={item} />
              </button>
            );
          })}
        </div>

        <AdSensePlaceholder slotId="archive-list-bottom" />
      </section>
    </StitchPageShell>
  );
};

const ArchiveCardContent = ({ item }: { item: ArchiveListItem }) => (
  <>
    <div className="min-w-0">
      <p className="text-ink-muted text-xs">{formatKstDateShort(item.puzzleDate)}</p>
      <h2 className="mt-1 truncate font-semibold">{item.title}</h2>
    </div>
    <div className="flex shrink-0 flex-col items-end gap-1.5">
      <Badge variant="outline" className={`shrink-0 ${availabilityBadgeClass[item.availability]}`}>
        {availabilityLabel[item.availability]}
      </Badge>
      <ThemeBadge themeId={item.themeId} />
    </div>
  </>
);
