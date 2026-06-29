"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Shuffle, Star } from "lucide-react";
import { cn } from "@1-blue/ui/lib/index";

const NAV_ITEMS = [
  { href: "/", label: "메인", icon: Home, match: (path: string) => path === "/" || path.startsWith("/category/") },
  { href: "/popular", label: "인기", icon: Star, match: (path: string) => path === "/popular" },
  { href: "/random", label: "랜덤", icon: Shuffle, match: (path: string) => path === "/random" },
] as const;

export const BottomNav = () => {
  const pathname = usePathname();

  return (
    <nav className="border-border bg-surface/95 fixed inset-x-0 bottom-0 z-50 mx-auto flex h-[var(--bottom-nav-height)] max-w-[680px] items-center justify-around border-t pb-[env(safe-area-inset-bottom)] backdrop-blur-md">
      {NAV_ITEMS.map(({ href, label, icon: Icon, match }) => {
        const active = match(pathname);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex min-h-11 min-w-[72px] flex-col items-center justify-center gap-0.5 text-[11px]",
              active ? "text-primary font-semibold" : "text-text-secondary",
            )}
          >
            <Icon className={cn("h-5 w-5", active && "text-primary")} strokeWidth={active ? 2.5 : 2} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
};
