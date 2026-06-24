"use client";

import { AdSensePlaceholder } from "@/app/_components/AdSensePlaceholder";

type PlayAdBannerProps = {
  slotId: string;
};

export const PlayAdBanner = ({ slotId }: PlayAdBannerProps) => {
  return (
    <AdSensePlaceholder
      slotId={slotId}
      className="opacity-90 [&_.adsbygoogle]:min-h-[50px]"
    />
  );
};
