"use client";

import { ROUTES } from "@/app/_constants/routes";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@1-blue/ui/components/button";
import { Input } from "@1-blue/ui/components/input";
import { CheckCircle2, Shield, User } from "lucide-react";
import { CopyLinkButton } from "@/app/_components/CopyLinkButton";
import { OpenLinkButton } from "@/app/_components/OpenLinkButton";
import { PageShell } from "@/app/_components/PageShell";

const CompletePageInner = () => {
  const params = useSearchParams();
  const adminToken = params.get("admin") ?? "";
  const publicId = params.get("public") ?? "";
  const title = params.get("title") ?? "새 CBT";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:7005";
  const adminUrl = `${siteUrl}${ROUTES.MANAGE.DETAIL.path(adminToken)}`;
  const publicUrl = `${siteUrl}${ROUTES.CBT.DETAIL.path(publicId)}`;

  return (
    <PageShell>
      <div className="surface-card mx-auto mt-8 max-w-lg space-y-6 p-6 text-center">
        <CheckCircle2 className="text-success mx-auto h-12 w-12" />
        <div>
          <h1 className="text-xl font-bold">CBT가 생성되었어요</h1>
          <p className="text-muted-foreground mt-1 text-sm">{title}</p>
        </div>

        <div className="space-y-3 rounded-lg border p-4 text-left">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-sm font-semibold">
              <Shield className="h-4 w-4" /> 관리자 링크
            </span>
            <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
              북마크 필수
            </span>
          </div>
          <div className="flex gap-2">
            <Input readOnly value={adminUrl} className="text-xs" />
            <OpenLinkButton href={adminUrl} />
            <CopyLinkButton value={adminUrl} />
          </div>
          <p className="text-destructive text-xs">
            링크 분실 시 복구할 수 없습니다. 반드시 북마크해 두세요.
          </p>
        </div>

        <div className="space-y-3 rounded-lg border p-4 text-left">
          <span className="inline-flex items-center gap-2 text-sm font-semibold">
            <User className="h-4 w-4" /> 응시자 링크
          </span>
          <div className="flex gap-2">
            <Input readOnly value={publicUrl} className="text-xs" />
            <OpenLinkButton href={publicUrl} />
            <CopyLinkButton value={publicUrl} variant="default" />
          </div>
          <p className="text-muted-foreground text-xs">이 링크를 복사하여 응시자에게 공유하세요.</p>
        </div>

        <div className="space-y-2">
          <Button asChild className="w-full">
            <Link href={ROUTES.MANAGE.DETAIL.path(adminToken)}>관리 페이지로 이동 →</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href={ROUTES.HOME.path}>홈으로</Link>
          </Button>
        </div>
      </div>
    </PageShell>
  );
};

export default CompletePageInner;
