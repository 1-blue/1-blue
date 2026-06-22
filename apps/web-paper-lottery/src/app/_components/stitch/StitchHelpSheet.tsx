"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@1-blue/ui/components/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@1-blue/ui/components/accordion";
import { FAQ_ITEMS } from "@/app/_config/site-seo";
import { stitchDialogContentClass } from "@/app/_components/stitch/stitch-dialog";

export type StitchPageVariant = "landing" | "admin" | "play" | "result";

const PAGE_HINTS: Record<StitchPageVariant, string> = {
  landing: "뽑기판을 만든 뒤 관리자 페이지로 이동합니다.",
  admin: "참가자별 링크·QR을 공유하고 진행 상황을 확인하세요.",
  play: "원하는 칸을 눌러 뜯으면 결과가 공개됩니다.",
  result: "전체 당첨 결과를 확인하고 링크를 공유할 수 있습니다.",
};

type StitchHelpSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant?: StitchPageVariant;
};

export const StitchHelpSheet = ({
  open,
  onOpenChange,
  variant = "landing",
}: StitchHelpSheetProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${stitchDialogContentClass} max-h-[85vh] overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle>도움말</DialogTitle>
          <DialogDescription className="text-ink/70">{PAGE_HINTS[variant]}</DialogDescription>
        </DialogHeader>
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
      </DialogContent>
    </Dialog>
  );
};
