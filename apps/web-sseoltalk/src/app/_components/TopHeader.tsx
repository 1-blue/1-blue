import Link from "next/link";
import { Shuffle } from "lucide-react";
import { SseoltalkMark } from "@/app/_components/SseoltalkMark";

export const TopHeader = () => {
  return (
    <header className="border-border bg-page-bg/95 sticky top-0 z-50 flex h-[var(--header-height)] items-center justify-between border-b px-4 backdrop-blur-md">
      <Link href="/" className="flex items-center gap-2.5">
        <SseoltalkMark className="h-8 w-8" />
        <span className="text-lg font-bold tracking-tight">썰톡</span>
      </Link>
      <Link
        href="/random"
        className="text-text-secondary hover:bg-surface-elevated hover:text-primary flex h-10 w-10 items-center justify-center rounded-full transition"
        aria-label="랜덤 썰"
      >
        <Shuffle className="h-5 w-5" />
      </Link>
    </header>
  );
};
