import type { ReactNode } from "react";
import { StitchFooter } from "@/app/_components/stitch/StitchFooter";
import { StitchHeader } from "@/app/_components/stitch/StitchHeader";

type StitchPageShellProps = {
  children: ReactNode;
  headerLabel?: string;
  showHomeLink?: boolean;
  compactHeader?: boolean;
  wide?: boolean;
  className?: string;
};

export const StitchPageShell = ({
  children,
  headerLabel,
  showHomeLink = false,
  compactHeader = false,
  wide = false,
  className = "",
}: StitchPageShellProps) => {
  return (
    <div
      className={`mx-auto flex min-h-screen flex-col px-4 sm:px-6 ${wide ? "max-w-3xl" : "max-w-lg md:max-w-2xl lg:max-w-3xl"} ${className}`}
    >
      <StitchHeader label={headerLabel} compact={compactHeader} />
      <main className="flex-1 pb-6">{children}</main>
      <StitchFooter showHomeLink={showHomeLink} />
    </div>
  );
};
