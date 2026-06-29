import type { ReactNode } from "react";
import { AdSensePlaceholder } from "@/app/_components/AdSensePlaceholder";
import { AppShell } from "@/app/_components/AppShell";

type LegalPageLayoutProps = {
  title: string;
  children: ReactNode;
};

export const LegalPageLayout = ({ title, children }: LegalPageLayoutProps) => {
  return (
    <AppShell>
      <section className="mx-auto max-w-2xl space-y-6 px-4 py-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="surface-card space-y-6 p-6">{children}</div>
        <AdSensePlaceholder slotId="legal-bottom" />
      </section>
    </AppShell>
  );
};
