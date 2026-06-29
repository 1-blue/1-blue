"use client";

import { useEffect, useState } from "react";
import { resolveCategoryFromSlug } from "@1-blue/core/sseoltalk";
import { AdSensePlaceholder } from "@/app/_components/AdSensePlaceholder";
import { AppShell } from "@/app/_components/AppShell";
import { CategoryTabs } from "@/app/_components/CategoryTabs";
import { StoryCard } from "@/app/_components/StoryCard";
import { CATEGORY_EMOJIS } from "@/app/_config/ui";
import type { StoryListItem } from "@/lib/repository";

type CategoryPageClientProps = {
  slug: string;
  initialItems?: StoryListItem[];
};

export const CategoryPageClient = ({ slug, initialItems }: CategoryPageClientProps) => {
  const category = resolveCategoryFromSlug(slug);
  const [items, setItems] = useState<StoryListItem[]>(initialItems ?? []);

  useEffect(() => {
    if (initialItems !== undefined || !category) {
      return;
    }
    const load = async () => {
      const response = await fetch(`/api/stories?category=${encodeURIComponent(category)}`);
      if (response.ok) {
        const data = (await response.json()) as { items: StoryListItem[] };
        setItems(data.items);
      }
    };
    void load();
  }, [category, initialItems]);

  if (!category) {
    return <p className="p-8 text-center">카테고리를 찾을 수 없습니다.</p>;
  }

  return (
    <AppShell>
      <CategoryTabs active={category} />
      <section className="py-4">
        <div className="mx-4 mb-4 rounded-2xl bg-white/5 p-5">
          <p className="text-3xl">{CATEGORY_EMOJIS[category]}</p>
          <h1 className="mt-2 text-2xl font-bold">{category} 썰</h1>
          <p className="text-text-secondary mt-1 text-sm">
            {category === "직장" && "퇴근하고 보면 더 웃긴 직장 채팅 모음"}
            {category === "연애" && "설레고 빡치는 연애 카톡 모음"}
            {category === "가족" && "가족 카톡의 은근한 반전 모음"}
            {category === "친구" && "친구 사이 애매한 순간 모음"}
            {category === "진상" && "현실적인 빌런 대화 모음"}
          </p>
        </div>
        {items.map((item, index) => (
          <div key={item.id}>
            <StoryCard {...item} />
            {(index + 1) % 3 === 0 && index >= 2 && (
              <div className="mx-4 mb-3">
                <AdSensePlaceholder slotId={`category-${index}`} />
              </div>
            )}
          </div>
        ))}
      </section>
    </AppShell>
  );
};
