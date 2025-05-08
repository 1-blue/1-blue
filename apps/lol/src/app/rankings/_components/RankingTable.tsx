"use client";

import { motion } from "framer-motion";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@1-blue/ui/components/table";
import type { Database } from "@1-blue/supabase";
import { cn } from "@1-blue/ui/lib";

const getRankingImogi = (index: number) => {
  switch (index) {
    case 0:
      return "🥇";
    case 1:
      return "🥈";
    case 2:
      return "🥉";
    default:
      return `${index + 1}`;
  }
};

interface IProps {
  rankings: Omit<Database["lol"]["Tables"]["rankings"]["Row"], "password">[];
  isCompact?: boolean;
  showQuizType?: boolean;
}

const RankingTable: React.FC<IProps> = ({
  rankings,
  isCompact = false,
  showQuizType = false,
}) => {
  let minTableWidth = 60; // 순위 열
  minTableWidth += 100; // 닉네임 열
  minTableWidth += 100; // 점수 열
  minTableWidth += 100; // 소요시간 열

  if (showQuizType) {
    minTableWidth += 100; // 모드 열
  }
  if (!isCompact) {
    minTableWidth += 100; // 날짜 열
  }

  return (
    <div className="max-w-2xl mx-auto border rounded-md overflow-hidden overflow-x-auto">
      <div className="max-h-[500px] overflow-y-auto">
        <Table
          className="w-full relative table-fixed"
          style={{ minWidth: `${minTableWidth}px` }}
        >
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow className="border-b-2 border-primary/20">
              <TableHead className="py-3 px-6 bg-background w-[60px] text-center">
                순위
              </TableHead>
              <TableHead className="py-3 px-6 bg-background text-center min-w-[100px]">
                닉네임
              </TableHead>
              <TableHead className="py-3 px-6 text-right bg-background min-w-[100px]">
                점수
              </TableHead>
              <TableHead className="py-3 px-6 text-right bg-background min-w-[100px]">
                소요시간
              </TableHead>
              {showQuizType && (
                <TableHead className="py-3 px-6 text-center bg-background min-w-[100px]">
                  모드
                </TableHead>
              )}
              {!isCompact && (
                <TableHead className="py-3 px-6 text-center bg-background min-w-[100px]">
                  날짜
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rankings.map((ranking, index) => {
              const minutes = Math.floor(ranking.completion_time / 60);
              const seconds = ranking.completion_time % 60;

              return (
                <motion.tr
                  key={ranking.id}
                  className={cn(
                    "border-b border-border/50",
                    index < 3 && "font-medium"
                  )}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <TableCell className="py-3 px-6 text-center">
                    {getRankingImogi(index)}
                  </TableCell>
                  <TableCell
                    className="py-3 px-6 text-center min-w-[100px]"
                    title={ranking.nickname}
                  >
                    {ranking.nickname.length > 6
                      ? `${ranking.nickname.slice(0, 6)}...`
                      : ranking.nickname}
                  </TableCell>
                  <TableCell className="py-3 px-6 text-right min-w-[100px]">
                    {ranking.score}점
                  </TableCell>
                  <TableCell className="py-3 px-6 text-right whitespace-nowrap min-w-[100px]">
                    {minutes}분 {seconds}초
                  </TableCell>
                  {showQuizType && (
                    <TableCell className="py-3 px-6 text-center min-w-[100px]">
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full text-xs whitespace-nowrap",
                          ranking.quiz_type === "multiple-choice" &&
                            "bg-blue-100 text-blue-700",
                          ranking.quiz_type === "short-answer" &&
                            "bg-green-100 text-green-700"
                        )}
                      >
                        {ranking.quiz_type === "multiple-choice"
                          ? "객관식"
                          : "주관식"}
                      </span>
                    </TableCell>
                  )}
                  {!isCompact && (
                    <TableCell className="py-3 px-6 text-center text-sm text-muted-foreground whitespace-nowrap min-w-[100px]">
                      {new Date(ranking.created_at || "").toLocaleDateString()}
                    </TableCell>
                  )}
                </motion.tr>
              );
            })}

            {rankings.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={
                    isCompact ? (showQuizType ? 5 : 4) : showQuizType ? 6 : 5
                  }
                  className="py-8 px-6 text-center text-muted-foreground"
                >
                  아직 랭킹 정보가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RankingTable;
