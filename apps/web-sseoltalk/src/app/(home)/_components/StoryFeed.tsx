"use client";

import { useCallback, useEffect, useState } from "react";
import { AdSensePlaceholder } from "@/app/_components/AdSensePlaceholder";
import { AppShell } from "@/app/_components/AppShell";
import { CategoryTabs } from "@/app/_components/CategoryTabs";
import { FaqSection } from "@/app/(home)/_components/FaqSection";
import { PopularCarousel } from "@/app/(home)/_components/PopularCarousel";
import { StoryCard } from "@/app/_components/StoryCard";
import type { StoryListItem } from "@/lib/repository";

type StoryFeedProps = {
  category?: string;
  activeTab?: string;
  showPopular?: boolean;
  title?: string;
  subtitle?: string;
  initialItems?: StoryListItem[];
  initialCursor?: string | null;
  initialPopularItems?: StoryListItem[];
};

export const StoryFeed = ({
  category,
  activeTab = "전체",
  showPopular = false,
  title = "최신 썰",
  subtitle = "방금 올라온 카톡 스타일 썰",
  initialItems,
  initialCursor = null,
  initialPopularItems,
}: StoryFeedProps) => {
  const [items, setItems] = useState<StoryListItem[]>(initialItems ?? []);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [loading, setLoading] = useState(initialItems === undefined);
  const [loadingMore, setLoadingMore] = useState(false);

  const load = useCallback(
    async (nextCursor?: string, append = false) => {
      const params = new URLSearchParams();
      if (category) {
        params.set("category", category);
      }
      if (nextCursor) {
        params.set("cursor", nextCursor);
      }
      const response = await fetch(`/api/stories?${params.toString()}`);
      if (!response.ok) {
        return;
      }
      const data = (await response.json()) as { items: StoryListItem[]; nextCursor: string | null };
      setItems((prev) => (append ? [...prev, ...data.items] : data.items));
      setCursor(data.nextCursor);
    },
    [category],
  );

  useEffect(() => {
    if (initialItems !== undefined) {
      return;
    }
    setLoading(true);
    void load().finally(() => setLoading(false));
  }, [initialItems, load]);

  return (
    <AppShell>
      <CategoryTabs active={activeTab} />
      <section className="py-4">
        {showPopular && (
          <PopularCarousel fallbackItems={items} initialItems={initialPopularItems} />
        )}

        <div className="mb-4 px-4">
          <h1 className="text-xl font-bold">{title}</h1>
          <p className="text-text-secondary mt-1 text-sm">{subtitle}</p>
        </div>

        {loading ? (
          <div className="space-y-3 px-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="surface-card h-44 animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="surface-card mx-4 p-8 text-center">
            <p className="font-medium">아직 공개된 썰이 없어요</p>
            <p className="text-text-secondary mt-2 text-sm">잠시 후 다시 확인해 주세요</p>
          </div>
        ) : (
          items.map((item, index) => (
            <div key={item.id}>
              <StoryCard {...item} />
              {(index + 1) % 3 === 0 && index >= 2 && (
                <div className="mx-4 mb-3">
                  <AdSensePlaceholder slotId={`feed-${index}`} />
                </div>
              )}
            </div>
          ))
        )}

        {cursor && (
          <div className="px-4 py-4 text-center">
            <button
              type="button"
              className="text-primary text-sm font-medium"
              disabled={loadingMore}
              onClick={() => {
                setLoadingMore(true);
                void load(cursor, true).finally(() => setLoadingMore(false));
              }}
            >
              {loadingMore ? "불러오는 중…" : "더 보기"}
            </button>
          </div>
        )}

        {showPopular && (
          <div className="px-4 pb-4">
            <FaqSection />
          </div>
        )}
      </section>
    </AppShell>
  );
};
