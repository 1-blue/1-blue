import Link from "next/link";
import { OperatorContactLinks } from "@1-blue/ui/components/operator-contact-links";

type StitchFooterProps = {
  showHomeLink?: boolean;
};

export const StitchFooter = ({ showHomeLink = false }: StitchFooterProps) => {
  return (
    <footer className="bg-footer -mx-6 mt-10 px-6 py-8 text-center text-sm text-white/75">
      {showHomeLink && (
        <Link
          href="/"
          className="bg-accent hover:bg-accent/90 mb-4 inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
        >
          오늘 낙서하러 가기
        </Link>
      )}
      <p className="mb-3 text-xs text-white/50">© 오늘의 낙서. All rights reserved.</p>
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
        linkClassName="text-white/75 hover:text-white underline"
        separator=""
      />
    </footer>
  );
};
