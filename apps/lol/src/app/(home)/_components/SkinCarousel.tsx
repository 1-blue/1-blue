"use client";

import { useMemo } from "react";
import SkinCard from "#src/app/skins/_components/SkinCard";
import useSkins from "#src/app/skins/_hooks/useSkins";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@1-blue/ui/components/carousel";

const SkinCarousel: React.FC = () => {
  const { shuffledSkins, isLoading } = useSkins();

  const slicedSkins = useMemo(() => {
    return shuffledSkins.slice(0, 50);
  }, [shuffledSkins]);

  if (isLoading || slicedSkins.length === 0) {
    return (
      <div className="w-full max-w-[400px] mx-auto">
        <div className="w-full aspect-[4/3] bg-muted/10 flex items-center justify-center rounded-md">
          <p className="text-center text-sm text-muted-foreground">
            {isLoading ? "로딩중..." : "스킨 데이터가 없습니다."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Carousel opts={{ loop: true, align: "start" }} className="w-full">
      <CarouselContent className="ml-0">
        {slicedSkins.map((skin) => (
          <CarouselItem key={skin.id} className="p-0 basis-full">
            <SkinCard skin={skin} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default SkinCarousel;
