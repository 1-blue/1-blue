"use client";

import { ROUTES } from "@/app/_constants/routes";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminBoardView } from "@/lib/types";
import { AdminDashboard } from "@/app/b/[shortCode]/_components/AdminDashboard";
import { StitchPageShell } from "@/app/_components/stitch/StitchPageShell";
import { useBoardPoll } from "@/app/_hooks/useBoardPoll";

type AdminPageClientProps = {
  shortCode: string;
  token: string;
  initialBoard: AdminBoardView;
};

export const AdminPageClient = ({ shortCode, token, initialBoard }: AdminPageClientProps) => {
  const router = useRouter();
  const [closing, setClosing] = useState(false);

  const { data: board, refresh } = useBoardPoll({
    fetcher: async () => {
      const res = await fetch(`/api/boards/${shortCode}/admin?token=${encodeURIComponent(token)}`);
      if (!res.ok) {
        throw new Error("fetch_failed");
      }
      return (await res.json()) as AdminBoardView;
    },
  });

  const current = board ?? initialBoard;

  const handleClose = async () => {
    setClosing(true);
    try {
      const res = await fetch(`/api/boards/${shortCode}/close?token=${encodeURIComponent(token)}`, {
        method: "PATCH",
      });
      if (res.ok) {
        await refresh();
        router.push(ROUTES.BOARD.RESULT.path(shortCode));
      }
    } finally {
      setClosing(false);
    }
  };

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const boardMeta = {
    shortCode: current.shortCode,
    title: current.title,
    expiresAt: current.expiresAt,
    resultUrl: `${origin}${ROUTES.BOARD.RESULT.path(current.shortCode)}`,
    adminUrl: `${origin}${ROUTES.BOARD.ADMIN.path(current.shortCode)}?token=${token}`,
  };

  return (
    <StitchPageShell headerLabel="문방구 뽑기" variant="admin" showSettings boardMeta={boardMeta}>
      <AdminDashboard board={current} onClose={handleClose} closing={closing} />
    </StitchPageShell>
  );
};
