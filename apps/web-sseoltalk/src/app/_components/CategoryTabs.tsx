"use client";

import { ROUTES } from "@/app/_constants/routes";

import Link from "next/link";
import { STORY_CATEGORIES } from "@/core";
import { CATEGORY_EMOJIS, categoryToSlug } from "@/app/_config/ui";
import { useDragScroll } from "@/app/_hooks/useDragScroll";
import { cn } from "@1-blue/ui/lib/index";

type CategoryTabsProps = {
  active?: string;
  basePath?: string;
};

const TABS = ["전체", ...STORY_CATEGORIES] as const;

export const CategoryTabs = ({ active = "전체", basePath = "/" }: CategoryTabsProps) => {
  const scrollRef = useDragScroll<HTMLDivElement>();

  return (
    <div className="border-border bg-page-bg/95 sticky top-[var(--sticky-tabs-top)] z-40 border-b backdrop-blur-md">
      <div ref={scrollRef} className="carousel-scroll drag-scroll px-4 py-2.5">
        {TABS.map((tab) => {
          const href =
            tab === "전체"
              ? basePath === "/"
                ? "/"
                : basePath
              : ROUTES.CATEGORY.DETAIL.path(categoryToSlug(tab));
          const isActive = active === tab;
          return (
            <Link
              key={tab}
              href={href}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition",
                isActive
                  ? "bg-primary text-white shadow-[0_2px_12px_rgb(139_123_255_/_0.35)]"
                  : "bg-surface-secondary text-text-secondary hover:text-text-primary",
              )}
            >
              {tab === "전체" ? tab : `${CATEGORY_EMOJIS[tab]} ${tab}`}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
