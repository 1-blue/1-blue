"use client";

import { AdSensePlaceholder } from "@/app/_components/AdSensePlaceholder";
import { DoodleBoard } from "@/app/_components/DoodleBoard";
import { FaqSection } from "@/app/_components/FaqSection";
import { HowItWorksSteps } from "@/app/_components/HowItWorksSteps";
import { LandingHero } from "@/app/_components/LandingHero";
import { StitchPageShell } from "@/app/_components/stitch/StitchPageShell";

export const HomePage = () => {
  return (
    <StitchPageShell headerLabel="오늘의 낙서" wide>
      <LandingHero />
      <AdSensePlaceholder slotId="landing-hero" />
      <DoodleBoard />
      <HowItWorksSteps />
      <AdSensePlaceholder slotId="landing-below-faq" />
      <FaqSection />
    </StitchPageShell>
  );
};
