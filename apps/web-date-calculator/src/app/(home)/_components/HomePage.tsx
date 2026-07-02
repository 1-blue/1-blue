"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@1-blue/ui/components/tabs";
import { AdSensePlaceholder } from "@/app/_components/AdSensePlaceholder";
import { DateOffsetTab } from "@/app/(home)/_components/DateOffsetTab";
import { DaysBetweenTab } from "@/app/(home)/_components/DaysBetweenTab";
import { FaqSection } from "@/app/(home)/_components/FaqSection";
import { SiteFooter } from "@/app/_components/SiteFooter";

export const HomePage = () => {
  return (
    <main className="mx-auto flex min-h-screen max-w-[720px] flex-col gap-6 p-4 pb-8 md:p-6">
      <header className="space-y-2 pt-2 text-center md:text-left">
        <h1 className="text-3xl font-semibold tracking-tight">날짜 계산기</h1>
        <p className="text-muted-foreground text-sm md:text-base">
          두 날짜 사이 며칠, 100일 후·전 날짜를 한 번에 계산하세요
        </p>
      </header>

      <div id="ad-slot-below-hero">
        <AdSensePlaceholder slotId="ad-slot-below-hero" />
      </div>

      <Tabs defaultValue="days-between" className="w-full">
        <TabsList className="grid h-11 w-full grid-cols-2">
          <TabsTrigger value="days-between">일수 계산</TabsTrigger>
          <TabsTrigger value="date-offset">날짜 더하기/빼기</TabsTrigger>
        </TabsList>
        <TabsContent value="days-between" className="mt-4">
          <DaysBetweenTab />
        </TabsContent>
        <TabsContent value="date-offset" className="mt-4">
          <DateOffsetTab />
        </TabsContent>
      </Tabs>

      <div id="ad-slot-below-result">
        <AdSensePlaceholder slotId="ad-slot-below-result" />
      </div>

      <FaqSection />
      <SiteFooter />
    </main>
  );
};
