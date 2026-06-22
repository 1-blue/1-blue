export const SiteFooter = () => {
  return (
    <footer className="bg-footer mt-8 py-6 text-center text-sm text-white/70">
      <a href="/privacy" className="hover:text-white underline">
        개인정보처리방침
      </a>
      {" · "}
      <a href="/terms" className="hover:text-white underline">
        이용약관
      </a>
    </footer>
  );
};
