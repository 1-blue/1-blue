"use client";

import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@1-blue/ui/components/card";
import { Tabs, TabsList, TabsTrigger } from "@1-blue/ui/components/tabs";

import { cn } from "@1-blue/ui/lib";
import { IQuiz } from "#src/app/game/_hooks/useQuizQuery";

type TImageType = "splash" | "loading";

interface IProps {
  skin: IQuiz;
}

const SkinCard: React.FC<IProps> = ({ skin }) => {
  const [imageType, setImageType] = useState<TImageType>("splash");
  const [isLoaded, setIsLoaded] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });

  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="max-w-sm mx-auto"
    >
      <Card className="overflow-hidden h-full flex flex-col py-1 gap-2">
        <CardHeader className="px-2">
          <Tabs
            value={imageType}
            onValueChange={(value) => setImageType(value as TImageType)}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="splash" className="text-xs py-1">
                스플래쉬
              </TabsTrigger>
              <TabsTrigger value="loading" className="text-xs py-1">
                로딩
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>

        <CardContent className="p-0 flex-grow">
          {/* 고정된 이미지 컨테이너 */}
          <div className="relative w-full h-[240px] overflow-hidden">
            {/* 스플래쉬 이미지 */}
            <img
              src={skin.splashImageUrl}
              alt={`${skin.correctAnswer} 스플래쉬`}
              className={cn(
                "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
                imageType === "splash" ? "opacity-100 z-10" : "opacity-0 z-0"
              )}
              onLoad={() => setIsLoaded(true)}
              loading="lazy"
            />

            {/* 로딩 이미지 */}
            <img
              src={skin.loadingImageUrl}
              alt={`${skin.correctAnswer} 로딩`}
              className={cn(
                "absolute inset-0 w-full h-full object-contain transition-opacity duration-300",
                imageType === "loading" ? "opacity-100 z-10" : "opacity-0 z-0"
              )}
              loading="lazy"
            />

            {/* 로딩 중 표시 */}
            {!isLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
                <p className="text-sm text-muted-foreground">로딩 중...</p>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-2 justify-center">
          <CardTitle className="text-center text-base truncate">
            {skin.correctAnswer}
          </CardTitle>
        </CardFooter>
      </Card>
    </motion.li>
  );
};

export default React.memo(SkinCard);
