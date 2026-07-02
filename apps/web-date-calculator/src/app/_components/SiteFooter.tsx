import { ROUTES } from "@/app/_constants/routes";
import { OperatorContactLinks } from "@1-blue/ui/components/operator-contact-links";

export const SiteFooter = () => {
  return (
    <footer className="mt-8 rounded-lg bg-[#101010] px-6 py-8 text-center text-sm text-[#a1a1aa]">
      <nav className="flex justify-center gap-4">
        <a href={ROUTES.PRIVACY.path} className="hover:text-white">
          개인정보처리방침
        </a>
        <span aria-hidden="true">·</span>
        <a href={ROUTES.TERMS.path} className="hover:text-white">
          이용약관
        </a>
      </nav>
      <OperatorContactLinks
        className="mt-4 gap-x-4 text-xs"
        linkClassName="text-[#a1a1aa] hover:text-white"
        separator="·"
      />
      <p className="mt-4 text-xs">© {new Date().getFullYear()} 날짜 계산기</p>
    </footer>
  );
};
