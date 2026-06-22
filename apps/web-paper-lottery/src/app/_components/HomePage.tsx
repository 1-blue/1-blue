"use client";

import { CreateBoardForm } from "@/app/_components/CreateBoardForm";
import { AdSensePlaceholder } from "@/app/_components/AdSensePlaceholder";
import { FaqJsonLd } from "@/app/_components/FaqJsonLd";
import { StitchPageShell } from "@/app/_components/stitch/StitchPageShell";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@1-blue/ui/components/accordion";
import { FAQ_ITEMS } from "@/app/_config/site-seo";

export const HomePage = () => {
  return (
    <>
      <FaqJsonLd items={FAQ_ITEMS} />
      <StitchPageShell headerLabel="문방구뽑기" variant="landing">
        <section className="mb-10 space-y-5 text-center">
          <div className="polaroid mx-auto w-fit">
            <div className="bg-wood flex h-36 w-52 items-center justify-center rounded-sm sm:h-44 sm:w-60">
              <div className="text-center text-white">
                <p className="text-4xl">🎟️</p>
                <p className="mt-2 text-sm font-bold opacity-90">추억의 뽑기판</p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-ink text-3xl font-black tracking-tight sm:text-4xl">
              온라인 종이뽑기
            </h1>
            <p className="text-ink/70 mx-auto max-w-xs text-sm leading-relaxed">
              추억의 종이뽑기판을 만들고
              <br />
              친구에게 링크를 보내세요
            </p>
          </div>
        </section>

        <AdSensePlaceholder slotId="landing-hero" />
        <CreateBoardForm />
        <AdSensePlaceholder slotId="landing-below-form" />

        <section className="paper-texture mt-8 rounded-xl border-2 border-[#d9c4a0] p-4">
          <h2 className="mb-3 text-center font-bold">자주 묻는 질문</h2>
          <Accordion type="single" collapsible className="w-full">
            {FAQ_ITEMS.map((item, index) => (
              <AccordionItem key={item.question} value={`faq-${index}`}>
                <AccordionTrigger className="text-left text-sm font-semibold">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-ink/70 text-sm">{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </StitchPageShell>
    </>
  );
};
