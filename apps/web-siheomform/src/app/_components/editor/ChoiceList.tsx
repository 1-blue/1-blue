"use client";

import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { EditorChoice, EditorQuestion } from "@/core";
import { addChoice, removeChoice, reorderChoices, setCorrectChoice } from "@/core";
import { Button } from "@1-blue/ui/components/button";
import { Textarea } from "@1-blue/ui/components/textarea";
import { GripVertical, Plus, Trash2, Check } from "lucide-react";
import { ImageUploadField } from "@/app/_components/editor/ImageUploadField";

type ChoiceListProps = {
  question: EditorQuestion;
  onChange: (question: EditorQuestion) => void;
};

const SortableChoiceRow = ({
  choice,
  question,
  onChange,
}: {
  choice: EditorChoice;
  question: EditorQuestion;
  onChange: (question: EditorQuestion) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: choice.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  const isCorrect = question.correctChoiceId === choice.id;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`surface-card flex flex-col gap-2 p-3 ${isCorrect ? "border-primary bg-primary/5 border-2" : ""}`}
    >
      <div className="flex items-start gap-2">
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground mt-2 cursor-grab touch-none"
          aria-label="보기 순서 변경"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <label className="mt-2 flex items-center gap-2">
          <input
            type="radio"
            name={`correct-${question.id}`}
            checked={question.correctChoiceId === choice.id}
            onChange={() => onChange(setCorrectChoice(question, choice.id))}
            className="accent-[var(--color-primary)]"
          />
          <span className="text-muted-foreground text-xs">정답</span>
        </label>
        <Textarea
          value={choice.content}
          placeholder="보기 내용"
          rows={1}
          className="min-h-10 flex-1 resize-none"
          onChange={(e) => {
            onChange({
              ...question,
              choices: question.choices.map((c) =>
                c.id === choice.id ? { ...c, content: e.target.value } : c,
              ),
            });
          }}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-destructive shrink-0"
          disabled={question.choices.length <= 2}
          onClick={() => onChange(removeChoice(question, choice.id))}
          aria-label="보기 삭제"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        {isCorrect && <Check className="text-primary mt-2 h-4 w-4 shrink-0" />}
      </div>
      <div className="pl-8">
        <ImageUploadField
          label="보기 이미지"
          value={choice.imageUrl}
          onChange={(url) => {
            onChange({
              ...question,
              choices: question.choices.map((c) =>
                c.id === choice.id ? { ...c, imageUrl: url } : c,
              ),
            });
          }}
        />
      </div>
    </div>
  );
};

export const ChoiceList = ({ question, onChange }: ChoiceListProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    onChange(reorderChoices(question, String(active.id), String(over.id)));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">보기 ({question.choices.length}/5)</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={question.choices.length >= 5}
          onClick={() => onChange(addChoice(question))}
        >
          <Plus className="mr-1 h-4 w-4" />
          보기 추가
        </Button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={question.choices.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {question.choices.map((choice) => (
              <SortableChoiceRow
                key={choice.id}
                choice={choice}
                question={question}
                onChange={onChange}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};
