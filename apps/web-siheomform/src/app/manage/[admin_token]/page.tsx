"use client";

import { ROUTES } from "@/app/_constants/routes";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@1-blue/ui/components/button";
import { Input } from "@1-blue/ui/components/input";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { CopyLinkButton } from "@/app/_components/CopyLinkButton";
import { MetaChips } from "@/app/_components/MetaChips";
import { OpenLinkButton } from "@/app/_components/OpenLinkButton";
import { PageShell } from "@/app/_components/PageShell";
import { StatusBadge } from "@/app/_components/StatusBadge";
import { removeMyCbt } from "@/app/_hooks/useMyCbts";
import { ManageStatsPanel, type ManageStatsData } from "@/app/manage/_components/ManageStatsPanel";

type ManageData = {
  metadata: {
    title: string;
    isPublic: boolean;
    timeLimitMinutes: number | null;
    passingScore: number;
  };
  publicId: string;
  questions: unknown[];
  stats: { attemptCount: number; averageScore: number | null };
};

const ManagePageClient = () => {
  const params = useParams<{ admin_token: string }>();
  const router = useRouter();
  const [data, setData] = useState<ManageData | null>(null);
  const [stats, setStats] = useState<ManageStatsData | null>(null);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:7005";

  useEffect(() => {
    const load = async () => {
      const [manageRes, statsRes] = await Promise.all([
        fetch(`/api/cbts/manage/${params.admin_token}`),
        fetch(`/api/cbts/manage/${params.admin_token}/stats`),
      ]);
      if (!manageRes.ok) {
        toast.error("시험을 찾을 수 없습니다");
        return;
      }
      setData((await manageRes.json()) as ManageData);
      if (statsRes.ok) {
        setStats((await statsRes.json()) as ManageStatsData);
      }
    };
    void load();
  }, [params.admin_token]);

  const handleDelete = async () => {
    if (!confirm("CBT를 삭제하시겠습니까?")) {
      return;
    }
    const response = await fetch(`/api/cbts/manage/${params.admin_token}`, { method: "DELETE" });
    if (response.ok) {
      removeMyCbt(params.admin_token);
      toast.success("삭제되었습니다");
      router.push(ROUTES.HOME.path);
    }
  };

  if (!data) {
    return (
      <PageShell>
        <p className="text-muted-foreground mt-8 text-center text-sm">불러오는 중…</p>
      </PageShell>
    );
  }

  const publicUrl = `${siteUrl}${ROUTES.CBT.DETAIL.path(data.publicId)}`;

  return (
    <PageShell wide>
      <div className="mt-6 space-y-8">
        <div className="mx-auto max-w-lg space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">{data.metadata.title}</h1>
              <StatusBadge status={data.metadata.isPublic ? "public" : "private"} />
            </div>
            <div className="mt-3">
              <MetaChips
                questionCount={data.questions.length}
                timeLimitMinutes={data.metadata.timeLimitMinutes}
                passingScore={data.metadata.passingScore}
              />
            </div>
          </div>

          <div className="surface-card grid grid-cols-2 gap-4 p-4 text-center">
            <div>
              <p className="text-muted-foreground text-xs">총 응시자</p>
              <p className="text-2xl font-bold">{data.stats.attemptCount}</p>
            </div>
            <div className="border-border border-l">
              <p className="text-muted-foreground text-xs">평균 점수</p>
              <p className="text-primary text-2xl font-bold">
                {data.stats.averageScore !== null ? `${data.stats.averageScore}점` : "-"}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex gap-2">
              <Input readOnly value={publicUrl} className="text-xs" />
              <OpenLinkButton href={publicUrl} />
              <CopyLinkButton value={publicUrl} label="복사" variant="default" />
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link href={ROUTES.MANAGE.DETAIL.EDIT.path(params.admin_token)}>
                <Pencil className="mr-2 h-4 w-4" /> 수정하기
              </Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive w-full cursor-pointer"
              onClick={() => void handleDelete()}
            >
              <Trash2 className="mr-2 h-4 w-4" /> CBT 삭제
            </Button>
          </div>
        </div>

        {stats && <ManageStatsPanel stats={stats} />}
      </div>
    </PageShell>
  );
};

export default ManagePageClient;
