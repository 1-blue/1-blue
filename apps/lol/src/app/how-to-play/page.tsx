"use client";

import type { NextPage } from "next";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@1-blue/ui/components/button";
import HowToPlayTabs from "./_components/HowToPlayTabs";
import { makeURLQueries } from "@1-blue/libs";
import routeMap from "#src/libs/routeMap";

const Page: NextPage = () => {
  return (
    <div className="flex flex-col items-center min-h-svh bg-gradient-to-b from-background to-muted/50 text-foreground p-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-3xl font-bold text-center text-foreground mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          게임 플레이 방법
        </motion.h1>

        <HowToPlayTabs />

        <motion.div
          className="mb-4 bg-card/60 rounded-lg p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-center text-card-foreground mb-2">
            두 가지 모드를 모두 도전해보세요!
          </h3>
          <p className="text-card-foreground/80 text-center mb-4">
            객관식은 쉽게, 주관식은 더 어렵게 도전해볼 수 있습니다.
          </p>
        </motion.div>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Link
              href={makeURLQueries(routeMap.game.index, {
                type: "multiple-choice",
              })}
            >
              <Button className="w-full h-12 font-bold">객관식 시작</Button>
            </Link>
            <Link
              href={makeURLQueries(routeMap.game.index, {
                type: "short-answer",
              })}
            >
              <Button variant="outline" className="w-full h-12 font-bold">
                주관식 시작
              </Button>
            </Link>
          </div>

          <Link href={routeMap.home.index} className="block w-full">
            <Button variant="outline" className="w-full">
              메인으로 돌아가기
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Page;
