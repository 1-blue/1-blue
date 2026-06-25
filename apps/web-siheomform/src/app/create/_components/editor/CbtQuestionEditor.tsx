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
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { EditorState } from "@1-blue/core/siheomform";
import {
  addQuestion,
  removeQuestion,
  reorderQuestions,
  updateQuestion,
} from "@1-blue/core/siheomform";
import { Plus } from "lucide-react";
import { useCallback } from "react";
import { QuestionBlockCard } from "@/app/create/_components/editor/QuestionBlockCard";

type CbtQuestionEditorProps = {
  state: EditorState;
  onChange: (state: EditorState) => void;
};

export const CbtQuestionEditor = ({ state, onChange }: CbtQuestionEditorProps) => {
  const commit = useCallback(
    (next: EditorState) => {
      onChange(next);
    },
    [onChange],
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    commit({
      questions: reorderQuestions(state.questions, String(active.id), String(over.id)),
    });
  };

  return (
    <div className="flex flex-1 flex-col gap-4">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={state.questions.map((q) => q.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {state.questions.map((question, index) => (
              <QuestionBlockCard
                key={question.id}
                question={question}
                index={index}
                canDelete={state.questions.length > 1}
                onChange={(nextQuestion) =>
                  commit(updateQuestion(state, question.id, nextQuestion))
                }
                onDelete={() => commit(removeQuestion(state, question.id))}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button
        type="button"
        className="border-border hover:border-primary/50 hover:bg-primary/5 flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-8 text-center transition-colors"
        onClick={() => commit(addQuestion({ questions: state.questions }))}
      >
        <Plus className="text-muted-foreground h-5 w-5" />
        <span className="text-muted-foreground text-sm font-medium">+ 문제 추가</span>
      </button>
    </div>
  );
};
