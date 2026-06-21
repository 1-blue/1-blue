export const SiteFooter = () => {
  return (
    <footer className="mt-8 rounded-lg bg-[#101010] px-6 py-8 text-center text-sm text-[#a1a1aa]">
      <nav className="flex justify-center gap-4">
        <a href="/privacy" className="hover:text-white">
          개인정보처리방침
        </a>
        <span aria-hidden="true">·</span>
        <a href="/terms" className="hover:text-white">
          이용약관
        </a>
      </nav>
      <p className="mt-4 text-xs">© {new Date().getFullYear()} 날짜 계산기</p>
    </footer>
  );
};
