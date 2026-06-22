import { SITE_OPERATOR } from "@1-blue/legal/operator";
import { cn } from "@1-blue/ui/lib/index";

type OperatorContactLinksProps = {
  className?: string;
  linkClassName?: string;
  separator?: string;
};

export const OperatorContactLinks = ({
  className,
  linkClassName,
  separator = "·",
}: OperatorContactLinksProps) => {
  const { contactEmail, kakaoOpenChatUrl, kakaoOpenChatLabel } = SITE_OPERATOR;

  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-x-3 gap-y-1", className)}>
      <a
        href={`mailto:${contactEmail}`}
        className={cn("hover:underline", linkClassName)}
        aria-label={`이메일 문의: ${contactEmail}`}
      >
        이메일 문의
      </a>
      {separator && (
        <span className="text-inherit opacity-50" aria-hidden>
          {separator}
        </span>
      )}
      <a
        href={kakaoOpenChatUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn("hover:underline", linkClassName)}
        aria-label={`카카오톡 오픈채팅 문의: ${kakaoOpenChatLabel}`}
      >
        카카오톡 문의
      </a>
    </div>
  );
};
