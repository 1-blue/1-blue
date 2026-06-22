import type { ReactNode } from "react";
import { StitchFooter } from "@/app/_components/stitch/StitchFooter";
import { StitchHeader, type StitchBoardMeta } from "@/app/_components/stitch/StitchHeader";
import type { StitchPageVariant } from "@/app/_components/stitch/StitchHelpSheet";

type StitchPageShellProps = {
  children: ReactNode;
  headerLabel?: string;
  variant?: StitchPageVariant;
  showSettings?: boolean;
  boardMeta?: StitchBoardMeta;
  className?: string;
};

export const StitchPageShell = ({
  children,
  headerLabel,
  variant = "landing",
  showSettings = false,
  boardMeta,
  className = "",
}: StitchPageShellProps) => {
  return (
    <div className={`mx-auto flex min-h-screen max-w-lg flex-col px-6 ${className}`}>
      <StitchHeader
        label={headerLabel}
        variant={variant}
        showSettings={showSettings}
        boardMeta={boardMeta}
      />
      <main className="flex-1 pb-6">{children}</main>
      <StitchFooter showHomeLink={variant !== "landing"} />
    </div>
  );
};
