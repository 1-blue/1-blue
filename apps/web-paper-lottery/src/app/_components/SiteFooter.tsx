import { ROUTES } from "@/app/_constants/routes";
export const SiteFooter = () => {
  return (
    <footer className="bg-footer mt-8 py-6 text-center text-sm text-white/70">
      <a href={ROUTES.PRIVACY.path} className="hover:text-white underline">
        개인정보처리방침
      </a>
      {" · "}
      <a href={ROUTES.TERMS.path} className="hover:text-white underline">
        이용약관
      </a>
    </footer>
  );
};
