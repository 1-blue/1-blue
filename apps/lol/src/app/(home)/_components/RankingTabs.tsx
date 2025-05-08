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
  const { multipleChoiceRankings, shortAnswerRankings, isLoading, error } =
    useRanking(10);

  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        랭킹을 불러오는 중 오류가 발생했습니다.
      </div>
    );
  }
  if (isLoading || !multipleChoiceRankings || !shortAnswerRankings) {
    return <div className="text-center py-4">랭킹 로딩 중...</div>;
  }

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
