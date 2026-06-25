import type { ReactNode } from "react";
import { AdSensePlaceholder } from "@/app/_components/AdSensePlaceholder";
import { PageShell } from "@/app/_components/PageShell";

type LegalPageLayoutProps = {
  title: string;
  children: ReactNode;
};

export const LegalPageLayout = ({ title, children }: LegalPageLayoutProps) => {
  return (
    <PageShell>
      <section className="mx-auto max-w-2xl space-y-6 py-4">
        <h1 className="text-2xl font-bold">{title}</h1>
        <AdSensePlaceholder slotId="legal-top" />
        <div className="surface-card space-y-6 p-6">{children}</div>
        <AdSensePlaceholder slotId="legal-bottom" />
      </section>
    </PageShell>
  );
};
