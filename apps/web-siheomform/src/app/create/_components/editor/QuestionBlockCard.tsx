"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { EditorQuestion } from "@1-blue/core/siheomform";
import { Button } from "@1-blue/ui/components/button";
import { Input } from "@1-blue/ui/components/input";
import { Textarea } from "@1-blue/ui/components/textarea";
import { ChevronDown, ChevronUp, GripVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import { ChoiceList } from "@/app/create/_components/editor/ChoiceList";
import { ImageUploadField } from "@/app/create/_components/editor/ImageUploadField";

type QuestionBlockCardProps = {
  question: EditorQuestion;
  index: number;
  canDelete: boolean;
  onChange: (question: EditorQuestion) => void;
  onDelete: () => void;
};

export const QuestionBlockCard = ({
  question,
  index,
  canDelete,
  onChange,
  onDelete,
}: QuestionBlockCardProps) => {
  const [expanded, setExpanded] = useState(true);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: question.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  const preview = question.content.trim() || "문제 내용을 입력하세요";

  return (
    <div ref={setNodeRef} style={style} className="surface-card overflow-hidden">
      <div className="border-border flex items-center gap-2 border-b px-4 py-3">
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground cursor-grab touch-none"
          aria-label="문제 순서 변경"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
          onClick={() => setExpanded((prev) => !prev)}
        >
          <span className="bg-primary/10 text-primary shrink-0 rounded px-2 py-0.5 text-xs font-semibold">
            Q{index + 1}
          </span>
          <span className="truncate text-sm font-medium">{preview}</span>
        </button>
        <Button type="button" variant="ghost" size="icon" onClick={() => setExpanded((prev) => !prev)}>
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-destructive"
          disabled={!canDelete}
          onClick={onDelete}
          aria-label="문제 삭제"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {expanded && (
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">문제</p>
            <Textarea
              value={question.content}
              placeholder="문제 내용을 입력하세요"
              rows={3}
              onChange={(e) => onChange({ ...question, content: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">배점 (선택)</p>
            <Input
              type="number"
              min={1}
              placeholder="자동 분배"
              value={question.points ?? ""}
              onChange={(e) => {
                const raw = e.target.value;
                onChange({
                  ...question,
                  points: raw === "" ? null : Number(raw) || null,
                });
              }}
              className="w-32"
            />
            <p className="text-muted-foreground text-xs">비우면 총점에서 자동으로 균등 분배됩니다.</p>
          </div>

          <ImageUploadField
            label="문제 이미지"
            value={question.imageUrl}
            onChange={(url) => onChange({ ...question, imageUrl: url })}
          />

          <ChoiceList question={question} onChange={onChange} />

          <div className="space-y-2">
            <p className="text-sm font-medium">해설</p>
            <Textarea
              value={question.explanation ?? ""}
              placeholder="해설 (선택)"
              rows={2}
              onChange={(e) => onChange({ ...question, explanation: e.target.value || null })}
            />
          </div>

          <ImageUploadField
            label="해설 이미지"
            value={question.explanationImageUrl}
            onChange={(url) => onChange({ ...question, explanationImageUrl: url })}
          />
        </div>
      )}
    </div>
  );
};
