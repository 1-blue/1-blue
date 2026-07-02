"use client";

import Link from "next/link";
import { Button } from "@1-blue/ui/components/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { ROUTES } from "@/app/_constants/routes";

type EditorTopBarProps = {
  questionCount: number;
  title?: string;
  backHref?: string;
  onSave?: () => void | Promise<void>;
  saving?: boolean;
};

export const EditorTopBar = ({
  questionCount,
  title = "문제 편집",
  backHref = ROUTES.CREATE.path,
  onSave,
  saving = false,
}: EditorTopBarProps) => {
  const handleSave = async () => {
    if (!onSave) {
      toast.success("저장되었습니다");
      return;
    }
    try {
      await onSave();
    } catch (error) {
      const message = error instanceof Error ? error.message : "저장에 실패했습니다";
      toast.error(message);
    }
  };

  return (
    <header className="border-border bg-background/95 sticky top-0 z-10 flex items-center justify-between gap-3 border-b px-4 py-3 backdrop-blur sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Button type="button" variant="ghost" size="icon" asChild>
          <Link href={backHref} aria-label="뒤로">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{title}</p>
          <span className="bg-primary/10 text-primary mt-1 inline-block rounded px-2 py-0.5 text-xs font-semibold">
            총 {questionCount}문제
          </span>
        </div>
      </div>
      <Button type="button" size="sm" onClick={() => void handleSave()} disabled={saving}>
        {saving ? "저장 중…" : "저장"}
      </Button>
    </header>
  );
};
