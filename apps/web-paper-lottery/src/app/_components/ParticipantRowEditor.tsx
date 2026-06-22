"use client";

import type { ParticipantInput } from "@1-blue/core/paper-lottery";
import { Button } from "@1-blue/ui/components/button";
import { Input } from "@1-blue/ui/components/input";
import { Label } from "@1-blue/ui/components/label";
import { Plus, Trash2 } from "lucide-react";

type ParticipantRowEditorProps = {
  value: ParticipantInput[];
  onChange: (value: ParticipantInput[]) => void;
};

export const ParticipantRowEditor = ({ value, onChange }: ParticipantRowEditorProps) => {
  const updateRow = (index: number, patch: Partial<ParticipantInput>) => {
    onChange(value.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  const addRow = () => {
    onChange([...value, { displayName: `참가자 ${value.length + 1}`, pickQuota: 1 }]);
  };

  const removeRow = (index: number) => {
    if (value.length <= 1) {
      return;
    }
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <Label>참가자</Label>
      {value.map((row, index) => (
        <div key={index} className="flex gap-2">
          <Input
            value={row.displayName}
            onChange={(e) => updateRow(index, { displayName: e.target.value })}
            placeholder="닉네임"
            className="bg-paper flex-1"
          />
          <div className="flex items-center gap-1">
            <Label className="text-muted-foreground text-xs whitespace-nowrap">뽑기</Label>
            <Input
              type="number"
              min={1}
              value={row.pickQuota}
              onChange={(e) => updateRow(index, { pickQuota: Number(e.target.value) })}
              className="bg-paper w-16"
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeRow(index)}
            disabled={value.length <= 1}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addRow}>
        <Plus className="mr-1 size-4" />
        참가자 추가
      </Button>
    </div>
  );
};
