"use client";

import type { ReactNode } from "react";
import { BottomNav } from "@/app/_components/BottomNav";
import { TopHeader } from "@/app/_components/TopHeader";

type AppShellProps = {
  children: ReactNode;
  hideBottomNav?: boolean;
};

export const AppShell = ({ children, hideBottomNav = false }: AppShellProps) => {
  return (
    <div className="bg-page-bg min-h-dvh">
      <div className="mx-auto flex min-h-dvh w-full max-w-[680px] flex-col">
        <TopHeader />
        <main className={hideBottomNav ? "min-h-0 flex-1" : "min-h-0 flex-1 pb-[calc(var(--bottom-nav-height)+env(safe-area-inset-bottom))]"}>
          {children}
        </main>
        {!hideBottomNav && <BottomNav />}
      </div>
    </div>
  );
};
