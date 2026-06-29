"use client";

import { useEffect, useState } from "react";
import { AdSensePlaceholder } from "@/app/_components/AdSensePlaceholder";
import { AppShell } from "@/app/_components/AppShell";
import { StoryCard } from "@/app/_components/StoryCard";
import type { StoryListItem } from "@/lib/repository";

export const PopularPageClient = ({ initialItems }: { initialItems?: StoryListItem[] }) => {
  const [items, setItems] = useState<StoryListItem[]>(initialItems ?? []);

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
    };
    void load();
  }, [initialItems]);

  return (
    <AppShell>
      <section className="py-4">
        <div className="mb-4 px-4">
          <h1 className="text-2xl font-bold">인기 썰</h1>
          <p className="text-text-secondary mt-1 text-sm">반응이 많은 썰 TOP 10</p>
        </div>
        {items.map((item, index) => (
          <div key={item.id}>
            <StoryCard {...item} rank={index + 1} />
            {index === 2 && (
              <div className="mx-4 mb-3">
                <AdSensePlaceholder slotId="popular-mid" />
              </div>
            )}
          </div>
        ))}
      </section>
    </AppShell>
  );
};
