"use client";

import { useQuery } from "@tanstack/react-query";
import { anonSupabase } from "#src/apis/annoSupabase";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@1-blue/ui/components/tabs";
import RankingList from "#src/components/ranking/RankingList";

// 랭킹 데이터 가져오기 함수
const fetchRankings = async () => {
  const { data, error } = await anonSupabase
    .schema("lol")
    .from("rankings")
    .select("id, nickname, score, completion_time, created_at, quiz_type")
    .order("score", { ascending: false })
    .order("completion_time", { ascending: true })
    .limit(10);

  if (error) throw new Error(error.message);
  return data || [];
};

export default function RankingContainer() {
  const {
    data: rankings = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["rankings", "top10"],
    queryFn: fetchRankings,
    staleTime: 1000 * 60 * 5, // 5분 동안 데이터 신선함 유지
    refetchOnWindowFocus: false, // 창 포커스 시 자동 리패치 비활성화
  });

  if (isLoading) {
    return <div className="text-center py-4">랭킹 로딩 중...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        랭킹을 불러오는 중 오류가 발생했습니다.
      </div>
    );
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
        <RankingList rankings={multipleChoiceRankings} isCompact={true} />
      </TabsContent>

      <TabsContent value="short-answer">
        <RankingList rankings={shortAnswerRankings} isCompact={true} />
      </TabsContent>
    </Tabs>
  );
}
