"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@1-blue/ui/components/tabs";
import RankingTable from "#src/app/rankings/_components/RankingTable";
import useRanking from "#src/app/rankings/_hooks/useRanking";

const RankingTabs: React.FC = () => {
  const { rankings, isLoading, error } = useRanking();

  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        랭킹을 불러오는 중 오류가 발생했습니다.
      </div>
    );
  }
  if (isLoading || !rankings) {
    return <div className="text-center py-4">랭킹 로딩 중...</div>;
  }

  // 주관식, 객관식별 랭킹 분리
  const multipleChoiceRankings = rankings.filter(
    (r) => r.quiz_type === "multiple-choice"
  );

  const shortAnswerRankings = rankings.filter(
    (r) => r.quiz_type === "short-answer"
  );

  return (
    <Tabs defaultValue="multiple-choice" className="w-full">
      <TabsList className="grid grid-cols-2 mb-4">
        <TabsTrigger value="multiple-choice">객관식 모드</TabsTrigger>
        <TabsTrigger value="short-answer">주관식 모드</TabsTrigger>
      </TabsList>

      <TabsContent value="multiple-choice">
        <RankingTable rankings={multipleChoiceRankings} isCompact />
      </TabsContent>

      <TabsContent value="short-answer">
        <RankingTable rankings={shortAnswerRankings} isCompact />
      </TabsContent>
    </Tabs>
  );
};

export default RankingTabs;
