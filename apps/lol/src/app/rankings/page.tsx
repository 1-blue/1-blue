import type { NextPage } from "next";
import Link from "next/link";
import { Button } from "@1-blue/ui/components/button";
import RankingTabs from "./_components/RankingTabs";
import routeMap from "#src/libs/routeMap";

const Page: NextPage = () => {
  return (
    <main className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">🏆 퀴즈 랭킹</h1>
          <Button asChild variant="outline">
            <Link href={routeMap.home.index}>메인으로 돌아가기</Link>
          </Button>
        </div>

        <RankingTabs />
      </div>
    </main>
  );
};

export default Page;
