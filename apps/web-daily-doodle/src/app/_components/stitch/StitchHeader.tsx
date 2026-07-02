import { ROUTES } from "@/app/_constants/routes";
import Link from "next/link";

type StitchHeaderProps = {
  label?: string;
  archiveLink?: boolean;
  compact?: boolean;
};

export const StitchHeader = ({
  label = "오늘의 낙서",
  archiveLink = true,
  compact = false,
}: StitchHeaderProps) => {
  if (compact) {
    return (
      <header className="flex items-center justify-between gap-2 py-2">
        <Link href={ROUTES.HOME.path} className="stamp-logo text-xs sm:text-sm" title="홈으로">
          {label}
        </Link>
        {archiveLink && (
          <Link
            href={ROUTES.ARCHIVE.path}
            className="text-ink/70 text-xs font-semibold underline-offset-2 hover:underline"
          >
            지난 낙서
          </Link>
        )}
      </header>
    );
  }

  return (
    <header className="flex items-center justify-between py-3">
      <Link href={ROUTES.HOME.path} className="stamp-logo text-sm sm:text-base" title="홈으로">
        {label}
      </Link>
      {archiveLink && (
        <Link
          href={ROUTES.ARCHIVE.path}
          className="text-ink/70 text-sm font-semibold underline-offset-2 hover:underline"
        >
          지난 낙서
        </Link>
      )}
    </header>
  );
};
