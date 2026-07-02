"use client";

import { useState } from "react";
import { formatDate, ko } from "@1-blue/libs";
import { Button } from "@1-blue/ui/components/button";
import { Calendar } from "@1-blue/ui/components/calendar";
import { Label } from "@1-blue/ui/components/label";
import { Popover, PopoverContent, PopoverTrigger } from "@1-blue/ui/components/popover";
import { cn } from "@1-blue/ui/lib/index";

type DatePickerFieldProps = {
  id: string;
  label: string;
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
};

export const DatePickerField = ({
  id,
  label,
  value,
  onChange,
  placeholder = "날짜 선택",
}: DatePickerFieldProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            className={cn(
              "h-11 w-full justify-start text-left font-normal",
              !value && "text-muted-foreground",
            )}
          >
            {value ? formatDate(value, "yyyy년 M월 d일", ko) : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="bg-background w-auto border p-0 shadow-md" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date) => {
              onChange(date);
              setOpen(false);
            }}
            locale={ko}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
