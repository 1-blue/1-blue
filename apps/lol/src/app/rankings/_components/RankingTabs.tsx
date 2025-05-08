"use client";

import { useMemo } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@1-blue/ui/components/tabs";
import useRanking from "#src/app/rankings/_hooks/useRanking";
import RankingTable from "#src/app/rankings/_components/RankingTable";

const RankingTabs: React.FC = () => {
  const { multipleChoiceRankings = [], shortAnswerRankings = [] } =
    useRanking();

  const allRankings = useMemo(() => {
    return [
      ...(multipleChoiceRankings ?? []),
      ...(shortAnswerRankings ?? []),
    ].sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.completion_time - b.completion_time;
    });
  }, [multipleChoiceRankings, shortAnswerRankings]);

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid grid-cols-3 mb-6 max-w-md mx-auto w-full">
        <TabsTrigger value="all">전체 랭킹</TabsTrigger>
        <TabsTrigger value="multiple-choice">객관식 모드</TabsTrigger>
        <TabsTrigger value="short-answer">주관식 모드</TabsTrigger>
      </TabsList>

      <TabsContent value="all">
        <RankingTable rankings={allRankings} showQuizType={true} />
      </TabsContent>

      <TabsContent value="multiple-choice">
        <RankingTable rankings={multipleChoiceRankings ?? []} />
      </TabsContent>

      <TabsContent value="short-answer">
        <RankingTable rankings={shortAnswerRankings ?? []} />
      </TabsContent>
    </Tabs>
  );
};

export default RankingTabs;
