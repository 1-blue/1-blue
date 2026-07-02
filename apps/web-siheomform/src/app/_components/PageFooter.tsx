import { ROUTES } from "@/app/_constants/routes";
import Link from "next/link";
import type { ReactNode } from "react";
import { OperatorContactLinks } from "@1-blue/ui/components/operator-contact-links";

type PageFooterProps = {
  showHomeLink?: boolean;
  extra?: ReactNode;
  className?: string;
};

export const PageFooter = ({ showHomeLink = false, extra, className = "" }: PageFooterProps) => {
  return (
    <footer
      className={`bg-footer mt-auto w-full shrink-0 px-6 py-8 text-center text-sm text-white/75 ${className}`}
    >
      {showHomeLink && (
        <Link
          href={ROUTES.HOME.path}
          className="mb-4 inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15"
        >
          홈으로
        </Link>
      )}
      {extra && (
        <div className="mb-3 flex flex-wrap items-center justify-center gap-2 text-xs">{extra}</div>
      )}
      <p className="mb-3 text-xs text-white/50">© 시험폼. All rights reserved.</p>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
        <Link href={ROUTES.TERMS.path} className="text-white/75 underline hover:text-white">
          이용약관
        </Link>
        <Link href={ROUTES.PRIVACY.path} className="text-white/75 underline hover:text-white">
          개인정보처리방침
        </Link>
      </div>
      <OperatorContactLinks
        className="mt-3 w-full gap-x-4 text-xs"
        linkClassName="text-white/75 hover:text-white underline"
        separator=""
      />
    </footer>
  );
};
