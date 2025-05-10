import Link from "next/link";
import { Button } from "@1-blue/ui/components/button";
import RankingTabs from "./_components/RankingTabs";
import type { Metadata, NextPage } from "next";
import SkinCarousel from "./_components/SkinCarousel";
import { makeURLQueries } from "@1-blue/libs";
import routeMap from "#src/libs/routeMap";

interface IProps {
  searchParams: Promise<{
    correctAnswers?: string;
    total?: string;
    timeMin?: string;
    timeSec?: string;
    type?: string;
  }>;
}

export const generateMetadata = async ({
  searchParams,
}: IProps): Promise<Metadata> => {
  const { correctAnswers, total, timeMin, timeSec, type } = await searchParams;

  let title = "리그오브레전드(lol) 스킨 퀴즈";
  let description = `리그오브레전드(lol) 챔피언 스킨, 아이템, 스킬을 맞춰보세요!\n리그 오브 레전드 챔피언 스킨 지식을 테스트해보세요! 객관식과 주관식 모드를 제공합니다.`;
  const imageUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Bard_35.jpg`;

  // 기본 메타데이터 값
  if (type === "multiple-choice") {
    title = "리그오브레전드(lol) 스킨 퀴즈 결과";
    description = `[모드: ${type}] 정답: ${correctAnswers} / ${total} 소요시간: ${timeMin}분 ${timeSec}초`;
  } else if (type === "short-answer") {
    title = "리그오브레전드(lol) 스킨 퀴즈 결과";
    description = `[모드: ${type}] 정답: ${correctAnswers} / ${total} 소요시간: ${timeMin}분 ${timeSec}초`;
  }

  return {
    title,
    description,
    keywords: [
      "퀴즈",
      "리그오브레전드",
      "스킨",
      "챔피언",
      "스킬",
      "아이템",
      "퀴즈",
      "맞히기",
      "맞추기",
      "리그오브레전드 스킨 퀴즈",
      "리그오브레전드 스킨 맞추기",
    ],
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "리그오브레전드 스킨 퀴즈 대표 이미지",
        },
      ],
      type: "website",
      siteName: "리그오브레전드 스킨 퀴즈",
    },
  };
};

const Home: NextPage = () => {
  return (
    <div className="flex flex-col items-center">
      <section className="text-center mb-10 max-w-3xl w-full px-4 pt-8">
        <h1 className="text-4xl font-bold mb-3">리그오브레전드 스킨 퀴즈</h1>
        <p className="text-xl text-gray-500 mb-6">
          리그 오브 레전드 챔피언 스킨을 맞춰보세요!
          <br />
          현재 사용중인 버전은 <b>{process.env.NEXT_PUBLIC_LOL_API_VERSION}</b>
          입니다.
        </p>

        <div className="flex gap-4 justify-center mb-8">
          <Link
            href={makeURLQueries(routeMap.game.index, {
              type: "multiple-choice",
            })}
          >
            <Button className="text-lg" size="lg">
              객관식 모드 시작
            </Button>
          </Link>

          <Link
            href={makeURLQueries(routeMap.game.index, {
              type: "short-answer",
            })}
          >
            <Button className="text-lg" size="lg" variant="outline">
              주관식 모드 시작
            </Button>
          </Link>
        </div>

        <div className="flex justify-center mt-4">
          <Button asChild variant="link">
            <Link href={routeMap.howToPlay.index}>
              게임 방법 자세히 알아보기
            </Link>
          </Button>

          <Button asChild variant="link">
            <Link href={routeMap.champions.skins.index}>스킨 갤러리 보기</Link>
          </Button>
        </div>
      </section>

      <section className="mb-6 max-w-xl w-full px-5">
        <SkinCarousel />
      </section>

      <section className="mt-6 w-full max-w-3xl px-4 pb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">🏆 랭킹</h2>
          <Button asChild variant="outline" size="sm">
            <Link href={routeMap.rankings.index}>전체 랭킹 보기</Link>
          </Button>
        </div>

        <RankingTabs />
      </section>
    </div>
  );
};

export default Home;
