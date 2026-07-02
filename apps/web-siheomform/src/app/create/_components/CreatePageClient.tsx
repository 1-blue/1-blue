"use client";

import { ROUTES } from "@/app/_constants/routes";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { validateCbtDraftForSave } from "@/core";
import { toast } from "sonner";
import { addMyCbt } from "@/app/_hooks/useMyCbts";
import { clearDraft, useCbtDraft } from "@/app/create/_hooks/useCbtDraft";
import { BasicSettingsSidebar } from "@/app/_components/editor/BasicSettingsSidebar";
import { CbtMetadataForm } from "@/app/_components/editor/CbtMetadataForm";
import { CbtQuestionEditor } from "@/app/_components/editor/CbtQuestionEditor";
import { EditorTopBar } from "@/app/_components/editor/EditorTopBar";

const saveCbt = async (draft: ReturnType<typeof useCbtDraft>["draft"]) => {
  const parsed = validateCbtDraftForSave(draft);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "유효성 검사에 실패했습니다");
  }

  const response = await fetch("/api/cbts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
  });

  const data = (await response.json()) as {
    adminToken?: string;
    publicId?: string;
    title?: string;
    questionCount?: number;
    error?: string;
  };

  if (!response.ok) {
    throw new Error(data.error ?? "저장에 실패했습니다");
  }

  return data;
};

export const CreatePageClient = () => {
  const router = useRouter();
  const { draft, setMetadata, setQuestions, hydrated } = useCbtDraft();
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await saveCbt(draft);
      if (result.adminToken && result.publicId) {
        addMyCbt({
          adminToken: result.adminToken,
          publicId: result.publicId,
          title: result.title ?? draft.metadata.title,
          questionCount: result.questionCount ?? draft.questions.length,
          updatedAt: new Date().toISOString(),
        });
        clearDraft();
        router.push(
          `/create/complete?admin=${encodeURIComponent(result.adminToken)}&public=${encodeURIComponent(result.publicId)}&title=${encodeURIComponent(result.title ?? draft.metadata.title)}`,
        );
      }
      toast.success("CBT가 생성되었습니다");
    } finally {
      setSaving(false);
    }
  };

  if (!hydrated) {
    return null;
  }

  return (
    <div className="bg-background flex min-h-dvh flex-col">
      <div className="hidden md:block">
        <EditorTopBar
          backHref={ROUTES.HOME.path}
          questionCount={draft.questions.length}
          onSave={handleSave}
          saving={saving}
        />
        <div className="mx-auto flex w-full max-w-[1084px] flex-1 flex-col gap-4 p-4 md:flex-row md:gap-6 md:p-6">
          <BasicSettingsSidebar metadata={draft.metadata} onChange={setMetadata} />
          <div className="min-w-0 flex-1">
            <CbtQuestionEditor
              state={{ questions: draft.questions }}
              onChange={(state) => setQuestions(state.questions)}
            />
          </div>
        </div>
      </div>

      <div className="md:hidden">
        <header className="border-border flex items-center gap-3 border-b px-4 py-3">
          <button type="button" onClick={() => router.push(ROUTES.HOME.path)} className="text-sm">
            ←
          </button>
          <h1 className="text-sm font-semibold">CBT 만들기</h1>
        </header>
        <div className="mx-auto w-full max-w-lg p-4">
          <CbtMetadataForm
            metadata={draft.metadata}
            onChange={setMetadata}
            showContinue
            onContinue={() => {
              if (!draft.metadata.title.trim()) {
                toast.error("시험 제목을 입력하세요");
                return;
              }
              router.push(ROUTES.CREATE.QUESTIONS.path);
            }}
          />
        </div>
      </div>
    </div>
  );
};
