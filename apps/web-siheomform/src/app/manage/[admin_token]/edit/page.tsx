"use client";

import { ROUTES } from "@/app/_constants/routes";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { CbtDraft } from "@/core";
import { validateCbtDraftForSave } from "@/core";
import { toast } from "sonner";
import { BasicSettingsSidebar } from "@/app/_components/editor/BasicSettingsSidebar";
import { CbtQuestionEditor } from "@/app/_components/editor/CbtQuestionEditor";
import { EditorTopBar } from "@/app/_components/editor/EditorTopBar";

const ManageEditPageClient = () => {
  const params = useParams<{ admin_token: string }>();
  const router = useRouter();
  const [draft, setDraft] = useState<CbtDraft | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const response = await fetch(`/api/cbts/manage/${params.admin_token}`);
      if (!response.ok) {
        toast.error("시험을 찾을 수 없습니다");
        return;
      }
      const data = (await response.json()) as CbtDraft;
      setDraft({ metadata: data.metadata, questions: data.questions });
    };
    void load();
  }, [params.admin_token]);

  const handleSave = async () => {
    if (!draft) {
      return;
    }
    const parsed = validateCbtDraftForSave(draft);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "유효성 검사에 실패했습니다");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/cbts/manage/${params.admin_token}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? "저장에 실패했습니다");
      }
      toast.success("저장되었습니다");
      router.push(ROUTES.MANAGE.DETAIL.path(params.admin_token));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "저장에 실패했습니다");
    } finally {
      setSaving(false);
    }
  };

  if (!draft) {
    return <p className="text-muted-foreground p-6 text-center text-sm">불러오는 중…</p>;
  }

  return (
    <div className="bg-background flex min-h-dvh flex-col">
      <EditorTopBar
        title="CBT 수정"
        backHref={ROUTES.MANAGE.DETAIL.path(params.admin_token)}
        questionCount={draft.questions.length}
        onSave={handleSave}
        saving={saving}
      />
      <div className="mx-auto flex w-full max-w-[1084px] flex-1 flex-col gap-4 p-4 md:flex-row md:gap-6 md:p-6">
        <BasicSettingsSidebar
          metadata={draft.metadata}
          onChange={(patch) =>
            setDraft((prev) =>
              prev ? { ...prev, metadata: { ...prev.metadata, ...patch } } : prev,
            )
          }
        />
        <div className="min-w-0 flex-1">
          <CbtQuestionEditor
            state={{ questions: draft.questions }}
            onChange={(state) =>
              setDraft((prev) => (prev ? { ...prev, questions: state.questions } : prev))
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ManageEditPageClient;
