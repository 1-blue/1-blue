"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { validateCbtDraftForSave } from "@1-blue/core/siheomform";
import { toast } from "sonner";
import { addMyCbt } from "@/app/_hooks/useMyCbts";
import { clearDraft, useCbtDraft } from "@/app/create/_hooks/useCbtDraft";
import { CbtQuestionEditor } from "@/app/create/_components/editor/CbtQuestionEditor";
import { EditorTopBar } from "@/app/create/_components/editor/EditorTopBar";

export const QuestionsPageClient = () => {
  const router = useRouter();
  const { draft, setQuestions, hydrated } = useCbtDraft();
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const parsed = validateCbtDraftForSave(draft);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "유효성 검사에 실패했습니다");
      return;
    }

    setSaving(true);
    try {
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

      if (data.adminToken && data.publicId) {
        addMyCbt({
          adminToken: data.adminToken,
          publicId: data.publicId,
          title: data.title ?? draft.metadata.title,
          questionCount: data.questionCount ?? draft.questions.length,
          updatedAt: new Date().toISOString(),
        });
        clearDraft();
        router.push(
          `/create/complete?admin=${encodeURIComponent(data.adminToken)}&public=${encodeURIComponent(data.publicId)}&title=${encodeURIComponent(data.title ?? draft.metadata.title)}`,
        );
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "저장에 실패했습니다");
    } finally {
      setSaving(false);
    }
  };

  if (!hydrated) {
    return null;
  }

  return (
    <div className="bg-background flex min-h-dvh flex-col md:hidden">
      <EditorTopBar
        questionCount={draft.questions.length}
        backHref="/create"
        onSave={handleSave}
        saving={saving}
      />
      <div className="mx-auto w-full max-w-lg flex-1 p-4">
        <CbtQuestionEditor
          state={{ questions: draft.questions }}
          onChange={(state) => setQuestions(state.questions)}
        />
      </div>
    </div>
  );
};
