import { ROUTES } from "@/app/_constants/routes";
import Link from "next/link";

type StitchHeaderProps = {
  label?: string;
  compact?: boolean;
};

export const StitchHeader = ({ label = "오늘의 추론", compact = false }: StitchHeaderProps) => {
  return (
    <header
      className={`flex items-center justify-between gap-3 ${compact ? "py-2" : "border-b border-white/5 py-4"}`}
    >
      <Link href={ROUTES.HOME.path} className="stamp-logo text-xs sm:text-sm" title="홈으로">
        {label}
      </Link>
      <nav className="text-ink-muted flex items-center gap-4 text-xs font-semibold sm:text-sm">
        <Link
          href={ROUTES.RANKING.path}
          className="hover:text-ink underline-offset-2 hover:underline"
        >
          랭킹
        </Link>
        <Link
          href={ROUTES.ARCHIVE.path}
          className="hover:text-ink underline-offset-2 hover:underline"
        >
          아카이브
        </Link>
      </nav>
    </header>
  );
};
