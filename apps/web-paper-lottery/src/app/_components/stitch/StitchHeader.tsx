"use client";

import { ROUTES } from "@/app/_constants/routes";

import { useState } from "react";
import Link from "next/link";
import { HelpCircle, Settings } from "lucide-react";
import { Button } from "@1-blue/ui/components/button";
import { StitchHelpSheet, type StitchPageVariant } from "@/app/_components/stitch/StitchHelpSheet";
import { StitchSettingsSheet } from "@/app/_components/stitch/StitchSettingsSheet";

export type StitchBoardMeta = {
  shortCode: string;
  title: string;
  expiresAt: string;
  resultUrl: string;
  adminUrl: string;
};

type StitchHeaderProps = {
  label?: string;
  variant?: StitchPageVariant;
  showSettings?: boolean;
  boardMeta?: StitchBoardMeta;
};

export const StitchHeader = ({
  label = "문방구뽑기",
  variant = "landing",
  showSettings = false,
  boardMeta,
}: StitchHeaderProps) => {
  const [helpOpen, setHelpOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between py-2">
        <div className="flex w-16 justify-start">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-ink/50 hover:text-ink size-9"
            aria-label="도움말"
            onClick={() => setHelpOpen(true)}
          >
            <HelpCircle className="size-5" />
          </Button>
        </div>
        {variant === "landing" ? (
          <div className="stamp-logo text-sm sm:text-base">{label}</div>
        ) : (
          <Link
            href={ROUTES.HOME.path}
            className="stamp-logo text-sm transition-opacity hover:opacity-80 sm:text-base"
            title="홈으로"
          >
            {label}
          </Link>
        )}
        <div className="flex w-16 justify-end">
          {showSettings && boardMeta ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-ink/50 hover:text-ink size-9"
              aria-label="보드 설정"
              onClick={() => setSettingsOpen(true)}
            >
              <Settings className="size-5" />
            </Button>
          ) : (
            <div className="size-9" />
          )}
        </div>
      </header>

      <StitchHelpSheet open={helpOpen} onOpenChange={setHelpOpen} variant={variant} />

      {showSettings && boardMeta && (
        <StitchSettingsSheet
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
          shortCode={boardMeta.shortCode}
          title={boardMeta.title}
          expiresAt={boardMeta.expiresAt}
          resultUrl={boardMeta.resultUrl}
          adminUrl={boardMeta.adminUrl}
        />
      )}
    </>
  );
};
