"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { StoryCategory } from "@1-blue/core/sseoltalk";
import { useDragScroll } from "@/app/_hooks/useDragScroll";
import { formatRelativeTime } from "@/lib/kst";
import {
  CATEGORY_CLASS,
  CATEGORY_EMOJIS,
} from "@/app/_config/ui";
import { ReactionCounts } from "@/app/_components/ReactionCounts";
import { cn } from "@1-blue/ui/lib/index";
import type { StoryListItem } from "@/lib/repository";

type PopularCarouselProps = {
  fallbackItems?: StoryListItem[];
  initialItems?: StoryListItem[];
};

export const PopularCarousel = ({
  fallbackItems = [],
  initialItems,
}: PopularCarouselProps) => {
  const [items, setItems] = useState<StoryListItem[]>(initialItems ?? []);
  const [loading, setLoading] = useState(initialItems === undefined);
  const scrollRef = useDragScroll<HTMLDivElement>();

  useEffect(() => {
    if (initialItems !== undefined) {
      return;
    }
    const load = async () => {
      const response = await fetch("/api/popular");
      if (response.ok) {
        const data = (await response.json()) as { items: StoryListItem[] };
        setItems(data.items);
      }
      setLoading(false);
    };
    void load();
  }, [initialItems]);

  const displayItems =
    items.length >= 3 ? items.slice(0, 5) : items.length > 0 ? items : fallbackItems.slice(0, 5);

  if (loading) {
    return (
      <section className="mb-2 px-4">
        <div className="mb-3 h-6 w-32 animate-pulse rounded bg-surface-secondary" />
        <div className="carousel-scroll carousel-scroll--cards">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="carousel-card surface-card h-44 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (displayItems.length === 0) {
    return null;
  }

  return (
    <section className="mb-4">
      <div className="mb-3 flex items-center justify-between px-4">
        <div>
          <p className="text-primary text-xs font-semibold tracking-wide">HOT</p>
          <h2 className="text-lg font-bold">인기 썰 TOP</h2>
        </div>
        <Link href="/popular" className="text-text-secondary text-sm hover:text-primary">
          전체 보기
        </Link>
      </div>
      <div ref={scrollRef} className="carousel-scroll carousel-scroll--cards drag-scroll px-4">
        {displayItems.map((item, index) => (
          <PopularCarouselCard key={item.id} item={item} rank={index + 1} />
        ))}
      </div>
    </section>
  );
};

const PopularCarouselCard = ({ item, rank }: { item: StoryListItem; rank: number }) => {
  const cat = item.category as StoryCategory;
  const catClass = CATEGORY_CLASS[cat] ?? "category-work";
  const preview = item.previewMessages[0];

  return (
    <Link href={`/story/${item.id}`} className={cn("carousel-card surface-card block p-4", catClass)}>
      <div className="flex items-center justify-between">
        <span className="rank-badge">{rank}</span>
        <span className={cn("category-badge rounded-full px-2 py-0.5 text-[10px] font-medium", catClass)}>
          {CATEGORY_EMOJIS[cat]}
        </span>
      </div>
      <h3 className="mt-3 line-clamp-2 text-[15px] font-bold leading-snug">{item.title}</h3>
      {preview && (
        <p className="text-text-secondary mt-2 line-clamp-2 text-xs leading-relaxed break-words">
          {preview.isMe ? "나: " : `${preview.sender}: `}
          {preview.content}
        </p>
      )}
      <div className="text-text-tertiary mt-3 flex items-center justify-between gap-2 text-[11px]">
        <ReactionCounts counts={item.reactionCounts} />
        <span className="shrink-0">{formatRelativeTime(item.createdAt)}</span>
      </div>
    </Link>
  );
};
