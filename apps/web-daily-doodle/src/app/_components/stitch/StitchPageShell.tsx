import type { ReactNode } from "react";
import { StitchFooter } from "@/app/_components/stitch/StitchFooter";
import { StitchHeader } from "@/app/_components/stitch/StitchHeader";

type StitchPageShellProps = {
  children: ReactNode;
  headerLabel?: string;
  showArchiveLink?: boolean;
  showHomeLink?: boolean;
  compactHeader?: boolean;
  /** 캔버스 등 넓은 영역용 — max-w-5xl */
  wide?: boolean;
  className?: string;
};

export const StitchPageShell = ({
  children,
  headerLabel,
  showArchiveLink = true,
  showHomeLink = false,
  compactHeader = false,
  wide = false,
  className = "",
}: StitchPageShellProps) => {
  return (
    <div
      className={`mx-auto flex min-h-screen flex-col px-4 sm:px-6 ${wide ? "max-w-5xl" : "max-w-lg"} ${className}`}
    >
      <StitchHeader label={headerLabel} archiveLink={showArchiveLink} compact={compactHeader} />
      <main className="flex-1 pb-6">{children}</main>
      <StitchFooter showHomeLink={showHomeLink} />
    </div>
  );
};
