"use client";

import type { PrizeConfigItem } from "@/core";
import { Button } from "@1-blue/ui/components/button";
import { Input } from "@1-blue/ui/components/input";
import { Label } from "@1-blue/ui/components/label";
import { Plus, Trash2 } from "lucide-react";

type PrizeConfigEditorProps = {
  value: PrizeConfigItem[];
  slotCount: number;
  onChange: (value: PrizeConfigItem[]) => void;
};

export const PrizeConfigEditor = ({ value, slotCount, onChange }: PrizeConfigEditorProps) => {
  const total = value.reduce((sum, item) => sum + item.count, 0);

  const updateItem = (index: number, patch: Partial<PrizeConfigItem>) => {
    onChange(value.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const addItem = () => {
    onChange([...value, { label: "새 등수", count: 1 }]);
  };

  const removeItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>등수 구성</Label>
        <span className={`text-sm ${total === slotCount ? "text-green-700" : "text-stamp"}`}>
          합계 {total} / {slotCount}칸
        </span>
      </div>
      {value.map((item, index) => (
        <div key={index} className="flex gap-2">
          <Input
            value={item.label}
            onChange={(e) => updateItem(index, { label: e.target.value })}
            placeholder="등수명"
            className="bg-paper flex-1"
          />
          <Input
            type="number"
            min={0}
            value={item.count}
            onChange={(e) => updateItem(index, { count: Number(e.target.value) })}
            className="bg-paper w-20"
          />
          <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(index)}>
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addItem}>
        <Plus className="mr-1 size-4" />
        등수 추가
      </Button>
    </div>
  );
};
