import { ROUTES } from "@/app/_constants/routes";
import Link from "next/link";
import { SiheomformMark } from "@/app/_components/SiheomformMark";

type PageHeaderProps = {
  label?: string;
};

export const PageHeader = ({ label = "시험폼" }: PageHeaderProps) => {
  return (
    <header className="border-border flex items-center justify-between gap-3 border-b py-4">
      <Link
        href={ROUTES.HOME.path}
        aria-label="시험폼 홈"
        className="text-primary flex min-w-0 items-center gap-2 text-sm font-bold tracking-tight sm:text-base"
      >
        <SiheomformMark size={24} className="shrink-0" />
        <span className="truncate">{label}</span>
      </Link>
      <nav className="text-muted-foreground flex shrink-0 items-center gap-4 text-xs font-medium sm:text-sm">
        <Link
          href={ROUTES.CREATE.path}
          className="hover:text-primary underline-offset-2 hover:underline"
        >
          만들기
        </Link>
      </nav>
    </header>
  );
};
