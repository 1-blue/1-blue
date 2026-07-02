import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@1-blue/ui/components/accordion";
import { FAQ_ITEMS } from "@/app/_config/site-seo";

export const FaqSection = () => {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">자주 묻는 질문</h2>
      <Accordion type="single" collapsible className="w-full">
        {FAQ_ITEMS.map((item, index) => (
          <AccordionItem key={item.question} value={`faq-${index}`}>
            <AccordionTrigger className="text-left text-sm">{item.question}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};
