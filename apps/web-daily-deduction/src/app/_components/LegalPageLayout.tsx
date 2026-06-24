import type { ReactNode } from "react";
import { AdSensePlaceholder } from "@/app/_components/AdSensePlaceholder";
import { StitchPageShell } from "@/app/_components/stitch/StitchPageShell";

type LegalPageLayoutProps = {
  title: string;
  children: ReactNode;
};

export const LegalPageLayout = ({ title, children }: LegalPageLayoutProps) => {
  return (
    <StitchPageShell showHomeLink>
      <section className="space-y-6 py-4">
        <h1 className="text-center text-2xl font-bold">{title}</h1>
        <AdSensePlaceholder slotId="legal-top" />
        <div className="surface-card space-y-6 p-6">{children}</div>
        <AdSensePlaceholder slotId="legal-bottom" />
      </section>
    </StitchPageShell>
  );
};
