"use client";

import { motion } from "framer-motion";
import type { QuizType } from "#src/app/game/context/QuizContext";

interface Ranking {
  id: string;
  nickname: string;
  score: number;
  completion_time: number;
  created_at: string;
  quiz_type: QuizType;
}

interface RankingListProps {
  rankings: Ranking[];
  isCompact?: boolean;
  showQuizType?: boolean;
}

const RankingList = ({
  rankings,
  isCompact = false,
  showQuizType = false,
}: RankingListProps) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-primary/20">
            <th className="py-3 text-left">순위</th>
            <th className="py-3 text-left">닉네임</th>
            <th className="py-3 text-right">점수</th>
            <th className="py-3 text-right">소요시간</th>
            {showQuizType && <th className="py-3 text-center">모드</th>}
            {!isCompact && <th className="py-3 text-right">날짜</th>}
          </tr>
        </thead>
        <tbody>
          {rankings.map((ranking, index) => {
            const minutes = Math.floor(ranking.completion_time / 60);
            const seconds = ranking.completion_time % 60;

            return (
              <motion.tr
                key={ranking.id}
                className={`border-b border-gray-200 ${index < 3 ? "font-medium" : ""}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <td className="py-3">
                  {index === 0
                    ? "🥇"
                    : index === 1
                      ? "🥈"
                      : index === 2
                        ? "🥉"
                        : `${index + 1}`}
                </td>
                <td className="py-3">{ranking.nickname}</td>
                <td className="py-3 text-right">{ranking.score}점</td>
                <td className="py-3 text-right">
                  {minutes}분 {seconds}초
                </td>
                {showQuizType && (
                  <td className="py-3 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        ranking.quiz_type === "multiple-choice"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {ranking.quiz_type === "multiple-choice"
                        ? "객관식"
                        : "주관식"}
                    </span>
                  </td>
                )}
                {!isCompact && (
                  <td className="py-3 text-right text-sm text-gray-500">
                    {new Date(ranking.created_at).toLocaleDateString()}
                  </td>
                )}
              </motion.tr>
            );
          })}

          {rankings.length === 0 && (
            <tr>
              <td
                colSpan={
                  isCompact ? (showQuizType ? 5 : 4) : showQuizType ? 6 : 5
                }
                className="py-8 text-center text-gray-500"
              >
                아직 랭킹 정보가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RankingList;
