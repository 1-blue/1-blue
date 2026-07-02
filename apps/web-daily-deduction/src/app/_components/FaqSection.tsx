"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@1-blue/ui/components/accordion";
import { FaqJsonLd } from "@/app/_components/FaqJsonLd";
import { FAQ_ITEMS } from "@/app/_config/site-seo";

export const FaqSection = () => {
  return (
    <section className="py-6">
      <FaqJsonLd items={FAQ_ITEMS} />
      <h2 className="mb-3 text-center text-lg font-bold">자주 묻는 질문</h2>
      <Accordion type="single" collapsible className="surface-card px-4">
        {FAQ_ITEMS.map((item, index) => (
          <AccordionItem key={item.question} value={`faq-${index}`}>
            <AccordionTrigger className="text-left text-sm font-semibold">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-ink-muted text-sm leading-relaxed">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};
