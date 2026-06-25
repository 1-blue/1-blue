import type { ReactNode } from "react";
import { PageShell } from "@/app/_components/PageShell";

type RouteStubProps = {
  title: string;
  description?: string;
  children?: ReactNode;
};

export const RouteStub = ({ title, description = "준비 중입니다." }: RouteStubProps) => {
  return (
    <PageShell>
      <div className="surface-card mt-6 space-y-2 p-6">
        <h1 className="text-lg font-semibold">{title}</h1>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </PageShell>
  );
};
