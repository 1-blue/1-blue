import { Clock, ListChecks, ShieldCheck } from "lucide-react";

type MetaChipsProps = {
  questionCount: number;
  timeLimitMinutes: number | null;
  passingScore: number;
};

export const MetaChips = ({ questionCount, timeLimitMinutes, passingScore }: MetaChipsProps) => {
  return (
    <div className="text-muted-foreground flex flex-wrap gap-2 text-xs">
      <span className="border-border inline-flex items-center gap-1 rounded-full border px-2.5 py-1">
        <ListChecks className="h-3.5 w-3.5" />
        문제 {questionCount}개
      </span>
      <span className="border-border inline-flex items-center gap-1 rounded-full border px-2.5 py-1">
        <Clock className="h-3.5 w-3.5" />
        {timeLimitMinutes ? `제한 ${timeLimitMinutes}분` : "시간 제한 없음"}
      </span>
      <span className="border-border inline-flex items-center gap-1 rounded-full border px-2.5 py-1">
        <ShieldCheck className="h-3.5 w-3.5" />
        합격 {passingScore}점
      </span>
    </div>
  );
};
