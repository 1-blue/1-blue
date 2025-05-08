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
  return (
    <div className="max-w-2xl mx-auto border rounded-md overflow-hidden">
      <div className="max-h-[500px] overflow-y-auto">
        <Table className="w-full relative table-fixed">
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow className="border-b-2 border-primary/20">
              <TableHead className="py-3 px-6 bg-background w-[60px]">
                순위
              </TableHead>
              <TableHead className="py-3 px-6 bg-background">닉네임</TableHead>
              <TableHead className="py-3 px-6 text-right bg-background">
                점수
              </TableHead>
              <TableHead className="py-3 px-6 text-right bg-background">
                소요시간
              </TableHead>
              {showQuizType && (
                <TableHead className="py-3 px-6 text-center bg-background">
                  모드
                </TableHead>
              )}
              {!isCompact && (
                <TableHead className="py-3 px-6 text-right bg-background">
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
                  <TableCell className="py-3 px-6">
                    {getRankingImogi(index)}
                  </TableCell>
                  <TableCell
                    className="py-3 px-6 truncate max-w-xs"
                    title={ranking.nickname}
                  >
                    {ranking.nickname}
                  </TableCell>
                  <TableCell className="py-3 px-6 text-right">
                    {ranking.score}점
                  </TableCell>
                  <TableCell className="py-3 px-6 text-right whitespace-nowrap">
                    {minutes}분 {seconds}초
                  </TableCell>
                  {showQuizType && (
                    <TableCell className="py-3 px-6 text-center">
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
                    <TableCell className="py-3 px-6 text-right text-sm text-muted-foreground whitespace-nowrap">
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
