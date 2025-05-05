import Link from "next/link";
import { Button } from "@1-blue/ui/components/button";
import { anonSupabase } from "#src/apis/annoSupabase";
import RankingList from "#src/components/ranking/RankingList";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@1-blue/ui/components/tabs";

export default async function RankingsPage() {
  const { data: rankings } = await anonSupabase
    .schema("lol")
    .from("rankings")
    .select("id, nickname, score, completion_time, created_at, quiz_type")
    .order("score", { ascending: false })
    .order("completion_time", { ascending: true })
    .limit(100);

  // 주관식, 객관식, 전체 랭킹 분리
  const allRankings = rankings || [];

  const multipleChoiceRankings = allRankings.filter(
    (r) => r.quiz_type === "multiple-choice"
  );

  const shortAnswerRankings = allRankings.filter(
    (r) => r.quiz_type === "short-answer"
  );

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">🏆 LOL 퀴즈 랭킹</h1>
          <Button asChild variant="outline">
            <Link href="/">메인으로 돌아가기</Link>
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6 max-w-md mx-auto">
            <TabsTrigger value="all">전체 랭킹</TabsTrigger>
            <TabsTrigger value="multiple-choice">객관식 모드</TabsTrigger>
            <TabsTrigger value="short-answer">주관식 모드</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <RankingList rankings={allRankings} showQuizType={true} />
          </TabsContent>

          <TabsContent value="multiple-choice">
            <RankingList rankings={multipleChoiceRankings} />
          </TabsContent>

          <TabsContent value="short-answer">
            <RankingList rankings={shortAnswerRankings} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
