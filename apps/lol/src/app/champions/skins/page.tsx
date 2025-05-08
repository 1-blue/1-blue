"use client";

import type { NextPage } from "next";
import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useDebounce } from "use-debounce";
import { VirtuosoGrid } from "react-virtuoso";

import { Input } from "@1-blue/ui/components/input";
import { Button } from "@1-blue/ui/components/button";
import SkinCard from "./_components/SkinCard";
import { VirtuosoGridComponent } from "./_components/VirtuosoGridComponent";
import useSkins from "./_hooks/useSkins";
import routeMap from "#src/libs/routeMap";

const OVERSCAN_PX = 2000;
const INCREASE_VIEWPORT_BY_PX = 2000;

const Page: NextPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const [isMounted, setIsMounted] = useState(false);

  const { skins, isLoading } = useSkins();

  // 필터링된 스킨 목록
  const filteredSkins = useMemo(() => {
    if (!skins) return [];
    if (!debouncedSearchQuery.trim()) return skins;

    return skins.filter((skin) =>
      skin.skin_name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );
  }, [skins, debouncedSearchQuery]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // SSR 렌더링 방지 (초기 로딩 상태 표시)
  if (!isMounted || isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        {isLoading ? "스킨 정보를 불러오는 중..." : "로딩 중..."}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4">
      {/* 헤더 영역 */}
      <div className="mb-6 px-4 relative">
        <div className="mb-4 px-4">
          <Link href={routeMap.home.index} passHref>
            <Button
              variant="outline"
              size="default"
              className="text-muted-foreground hover:text-foreground absolute top-0 right-0"
              aria-label="홈으로 가기"
            >
              메인으로 돌아가기
            </Button>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 text-center"
        >
          <h1 className="text-3xl font-bold mb-2">챔피언 스킨 갤러리</h1>
          <p className="text-muted-foreground">
            리그 오브 레전드 스킨을 감상하세요
          </p>
        </motion.div>

        <div className="mb-6 max-w-lg mx-auto">
          <Input
            type="text"
            placeholder="스킨 이름 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* VirtuosoGrid 영역 */}
      {filteredSkins.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg text-muted-foreground">검색 결과가 없습니다</p>
        </div>
      ) : (
        <VirtuosoGrid
          useWindowScroll
          totalCount={filteredSkins.length}
          overscan={OVERSCAN_PX}
          increaseViewportBy={INCREASE_VIEWPORT_BY_PX}
          components={VirtuosoGridComponent}
          itemContent={(index) => (
            <SkinCard
              key={filteredSkins[index].id}
              skin={filteredSkins[index]}
            />
          )}
          computeItemKey={(index) => filteredSkins[index]?.id || index}
        />
      )}
    </div>
  );
};

export default Page;
