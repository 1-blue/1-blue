import Link from "next/link";
import { OperatorContactLinks } from "@1-blue/ui/components/operator-contact-links";

type StitchFooterProps = {
  showHomeLink?: boolean;
};

export const StitchFooter = ({ showHomeLink = false }: StitchFooterProps) => {
  return (
    <footer className="bg-footer -mx-4 mt-10 px-4 py-8 text-center text-sm text-white/70 sm:-mx-6 sm:px-6">
      {showHomeLink && (
        <Link
          href="/"
          className="bg-accent hover:bg-accent/90 mb-4 inline-flex min-h-11 items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-[#1a120b]"
        >
          오늘의 추론 풀기
        </Link>
      )}
      <p className="mb-3 text-xs text-white/45">© 오늘의 추론. All rights reserved.</p>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
        <a href="/terms" className="hover:text-white underline">
          이용약관
        </a>
        <a href="/privacy" className="hover:text-white underline">
          개인정보처리방침
        </a>
      </div>
      <OperatorContactLinks
        className="mt-3 w-full gap-x-4 text-xs"
        linkClassName="text-white/70 hover:text-white underline"
        separator=""
      />
    </footer>
  );
};
