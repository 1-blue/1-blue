import { ROUTES } from "@/app/_constants/routes";
import Link from "next/link";
import type { StoryCategory } from "@/core";
import type { ReactionType } from "@/core";
import { formatRelativeTime } from "@/lib/kst";
import { CATEGORY_CLASS, CATEGORY_EMOJIS, formatCount } from "@/app/_config/ui";
import { ReactionCounts } from "@/app/_components/ReactionCounts";
import { cn } from "@1-blue/ui/lib/index";

type StoryCardProps = {
  id: string;
  category: string;
  title: string;
  createdAt: string;
  viewCount: number;
  commentCount: number;
  reactionCounts: Record<ReactionType, number>;
  previewMessages: Array<{ sender: string; isMe: boolean; content: string }>;
  rank?: number;
  compact?: boolean;
};

export const StoryCard = ({
  id,
  category,
  title,
  createdAt,
  viewCount,
  commentCount,
  reactionCounts,
  previewMessages,
  rank,
  compact = false,
}: StoryCardProps) => {
  const cat = category as StoryCategory;
  const catClass = CATEGORY_CLASS[cat] ?? "category-work";

  return (
    <Link
      href={ROUTES.STORY.DETAIL.path(id)}
      className={cn(
        "surface-card group mb-3 block overflow-hidden transition hover:border-primary/30",
        catClass,
        compact ? "mx-0 p-4" : "mx-4 p-4",
      )}
      style={{ borderLeftWidth: 3, borderLeftColor: `var(--cat-color)` }}
    >
      <div
        className={cn(
          "category-badge mb-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
          catClass,
        )}
      >
        {CATEGORY_EMOJIS[cat]} {category}
      </div>

      <div className="flex items-start gap-3">
        {rank !== undefined && <span className="rank-badge shrink-0">{rank}</span>}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h2
              className={cn(
                "line-clamp-2 font-bold leading-snug",
                compact ? "text-[15px]" : "text-lg",
              )}
            >
              {title}
            </h2>
            <span className="text-text-tertiary shrink-0 text-[11px]">
              {formatRelativeTime(createdAt)}
            </span>
          </div>

          <div className="bg-chat-bg/60 mt-3 space-y-2 rounded-xl p-3">
            {previewMessages.slice(0, 2).map((msg, i) => (
              <div
                key={`${msg.sender}-${i}`}
                className={cn(
                  "max-w-[90%] px-3 py-2 text-[14px] leading-relaxed break-words",
                  msg.isMe ? "bubble-me ml-auto" : "bubble-other",
                )}
              >
                {!msg.isMe && (
                  <span className="text-text-secondary mb-0.5 block text-[10px] font-medium">
                    {msg.sender}
                  </span>
                )}
                {msg.content}
              </div>
            ))}
            <p className="text-text-tertiary text-center text-[11px]">··· 더 읽기</p>
          </div>

          <div className="text-text-secondary mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
            <ReactionCounts counts={reactionCounts} />
            <span>💬 {formatCount(commentCount)}</span>
            <span>👁 {formatCount(viewCount)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
