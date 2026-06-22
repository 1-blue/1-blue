import Link from "next/link";

type StitchFooterProps = {
  showHomeLink?: boolean;
};

export const StitchFooter = ({ showHomeLink = false }: StitchFooterProps) => {
  return (
    <footer className="bg-footer -mx-6 mt-10 px-6 py-8 text-center text-sm text-white/75">
      {showHomeLink && (
        <Link
          href="/"
          className="mb-4 inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15"
        >
          홈으로 — 새 뽑기판 만들기
        </Link>
      )}
      <p className="mb-3 text-xs text-white/50">© 1994 추억의 문방구. All rights reserved.</p>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
        <a href="/terms" className="hover:text-white underline">
          이용약관
        </a>
        <a href="/privacy" className="hover:text-white underline">
          개인정보처리방침
        </a>
        <a href="mailto:contact@example.com" className="hover:text-white underline">
          문의하기
        </a>
      </div>
    </footer>
  );
};
