"use client";

import { useState } from "react";
import type { NextPage } from "next";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@1-blue/ui/components/button";

const HowToPlayPage: NextPage = () => {
  const [activeTab, setActiveTab] = useState<
    "basics" | "multiple-choice" | "short-answer"
  >("basics");

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

        {/* 탭 목록 */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <button
            onClick={() => setActiveTab("basics")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "basics"
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-accent text-muted-foreground"
            }`}
          >
            기본 규칙
          </button>
          <button
            onClick={() => setActiveTab("multiple-choice")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "multiple-choice"
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-accent text-muted-foreground"
            }`}
          >
            객관식
          </button>
          <button
            onClick={() => setActiveTab("short-answer")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "short-answer"
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-accent text-muted-foreground"
            }`}
          >
            주관식
          </button>
        </div>

        {/* 기본 규칙 탭 */}
        {activeTab === "basics" && (
          <div className="space-y-6 mb-8">
            <motion.div
              className="bg-card/80 border border-border rounded-lg p-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h2 className="text-xl font-semibold text-card-foreground mb-2">
                👀 이미지 확인
              </h2>
              <p className="text-card-foreground/80">
                화면에 표시되는 리그 오브 레전드 챔피언 스킨 이미지를 잘
                살펴보세요.
              </p>
            </motion.div>

            <motion.div
              className="bg-card/80 border border-border rounded-lg p-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <h2 className="text-xl font-semibold text-card-foreground mb-2">
                ⏱️ 제한 시간
              </h2>
              <p className="text-card-foreground/80">
                각 문제는 15초 이내에 맞혀야 합니다. 시간이 초과되면 자동으로
                오답 처리됩니다.
              </p>
            </motion.div>

            <motion.div
              className="bg-card/80 border border-border rounded-lg p-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <h2 className="text-xl font-semibold text-card-foreground mb-2">
                💯 점수 획득
              </h2>
              <p className="text-card-foreground/80">
                정답을 맞히면 100점을 획득합니다. 총 10문제를 풀어 1000점을
                목표로 도전해보세요!
              </p>
            </motion.div>
          </div>
        )}

        {/* 객관식 탭 */}
        {activeTab === "multiple-choice" && (
          <div className="space-y-6 mb-8">
            <motion.div
              className="bg-card/80 border border-border rounded-lg p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2 className="text-xl font-semibold text-card-foreground mb-2">
                🔢 객관식 퀴즈 방법
              </h2>
              <p className="text-card-foreground/80 mb-3">
                챔피언 스킨 이미지를 보고 5개의 선택지 중에서 정확한 스킨 이름을
                선택하세요.
              </p>
              <ul className="space-y-2 text-card-foreground/80">
                <li className="flex items-start">
                  <span className="mr-2">1.</span>
                  <span>화면에 표시된 스킨 이미지를 확인합니다.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">2.</span>
                  <span>
                    5개의 번호 선택지 중 정확한 스킨 이름을 선택합니다.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">3.</span>
                  <span>정답이면 초록색, 오답이면 빨간색으로 표시됩니다.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">4.</span>
                  <span>다음 버튼을 클릭하여 다음 문제로 넘어갑니다.</span>
                </li>
              </ul>
            </motion.div>
          </div>
        )}

        {/* 주관식 탭 */}
        {activeTab === "short-answer" && (
          <div className="space-y-6 mb-8">
            <motion.div
              className="bg-card/80 border border-border rounded-lg p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2 className="text-xl font-semibold text-card-foreground mb-2">
                ✍️ 주관식 퀴즈 방법
              </h2>
              <p className="text-card-foreground/80 mb-3">
                챔피언 스킨 이미지를 보고 스킨 이름을 직접 입력하세요.
              </p>
              <ul className="space-y-2 text-card-foreground/80">
                <li className="flex items-start">
                  <span className="mr-2">1.</span>
                  <span>화면에 표시된 스킨 이미지를 확인합니다.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">2.</span>
                  <span>텍스트 입력창에 스킨 이름을 입력합니다.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">3.</span>
                  <span>
                    띄어쓰기는 무시되며, 대소문자를 구분하지 않습니다.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">4.</span>
                  <span>
                    제출 버튼을 누르거나 엔터키를 눌러 정답을 제출합니다.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">5.</span>
                  <span>오답인 경우 정답을 확인할 수 있습니다.</span>
                </li>
              </ul>
            </motion.div>
          </div>
        )}

        <motion.div
          className="mt-8 mb-4 bg-card/60 rounded-lg p-4"
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
            <Link href="/game?type=multiple-choice">
              <Button className="w-full h-12 font-bold">객관식 시작</Button>
            </Link>
            <Link href="/game?type=short-answer">
              <Button variant="outline" className="w-full h-12 font-bold">
                주관식 시작
              </Button>
            </Link>
          </div>

          <Link href="/" className="block w-full">
            <Button variant="outline" className="w-full">
              메인으로 돌아가기
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default HowToPlayPage;
