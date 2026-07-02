"use client";

import { Heart } from "lucide-react";

type LikeButtonProps = {
  liked: boolean;
  count: number;
  disabled?: boolean;
  onToggle: () => void;
  size?: "sm" | "md";
};

export const LikeButton = ({
  liked,
  count,
  disabled = false,
  onToggle,
  size = "sm",
}: LikeButtonProps) => {
  const iconClass = size === "md" ? "h-5 w-5" : "h-4 w-4";
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onToggle}
      className={`inline-flex cursor-pointer items-center gap-1 rounded-full px-2 py-1 text-xs transition hover:bg-muted/60 disabled:cursor-not-allowed disabled:opacity-50 ${
        liked ? "text-red-500" : "text-muted-foreground"
      }`}
      aria-label={liked ? "좋아요 취소" : "좋아요"}
    >
      <Heart className={iconClass} fill={liked ? "currentColor" : "none"} />
      <span>{count}</span>
    </button>
  );
};
