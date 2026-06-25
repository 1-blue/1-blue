import Link from "next/link";
import type { ReactNode } from "react";
import { PageFooter } from "@/app/_components/PageFooter";
import { PageHeader } from "@/app/_components/PageHeader";

type PageShellProps = {
  children: ReactNode;
  headerLabel?: string;
  showHomeLink?: boolean;
  wide?: boolean;
  hideFooter?: boolean;
  className?: string;
};

export const PageShell = ({
  children,
  headerLabel = "시험폼",
  showHomeLink = false,
  wide = false,
  hideFooter = false,
  className = "",
}: PageShellProps) => {
  const contentWidth = wide ? "max-w-[1084px]" : "max-w-lg md:max-w-2xl";

  return (
    <div className={`flex min-h-dvh flex-col ${className}`}>
      <div className={`mx-auto flex w-full flex-1 flex-col px-4 sm:px-6 ${contentWidth}`}>
        <PageHeader label={headerLabel} />
        <main className="flex-1 pb-6">{children}</main>
      </div>
      {!hideFooter && (
        <PageFooter
          showHomeLink={showHomeLink}
          extra={
            showHomeLink ? undefined : (
              <Link href="/create" className="text-white/75 underline hover:text-white">
                시험 만들기
              </Link>
            )
          }
        />
      )}
    </div>
  );
};
