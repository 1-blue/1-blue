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
import { Database } from "@1-blue/supabase";

type TImageType = "splash" | "loading";

interface IProps {
  skin: Database["lol"]["Tables"]["champion_skins"]["Row"];
}

const SkinCard: React.FC<IProps> = ({ skin }) => {
  const [imageType, setImageType] = useState<TImageType>("splash");
  const [isSplashLoaded, setIsSplashLoaded] = useState(false);
  const [isLoadingImgLoaded, setIsLoadingImgLoaded] = useState(false);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });

  const showLoadingIndicator =
    (imageType === "splash" && !isSplashLoaded) ||
    (imageType === "loading" && !isLoadingImgLoaded);

  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="w-full max-w-[400px] mx-auto list-none"
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
          <div className="relative w-full aspect-video overflow-hidden bg-muted/10">
            {/* 스플래쉬 이미지 */}
            <img
              src={skin.splash_image_url}
              alt={`${skin.skin_name} 스플래쉬`}
              className={cn(
                "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
                imageType === "splash"
                  ? "opacity-100 z-10"
                  : "opacity-0 z-0 pointer-events-none"
              )}
              onLoad={() => setIsSplashLoaded(true)}
              loading="lazy"
            />

            {/* 로딩 이미지 */}
            <img
              src={skin.loading_image_url}
              alt={`${skin.skin_name} 로딩`}
              className={cn(
                "absolute inset-0 w-full h-full object-contain transition-opacity duration-300",
                imageType === "loading"
                  ? "opacity-100 z-10"
                  : "opacity-0 z-0 pointer-events-none"
              )}
              onLoad={() => setIsLoadingImgLoaded(true)}
              loading="lazy"
            />

            {/* 로딩 중 표시 */}
            {showLoadingIndicator && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <p className="text-sm text-white">로딩 중...</p>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-2 justify-center">
          <CardTitle className="text-center text-base truncate min-h-6 flex items-center justify-center">
            {skin.skin_name}
          </CardTitle>
        </CardFooter>
      </Card>
    </motion.li>
  );
};

export default React.memo(SkinCard);
