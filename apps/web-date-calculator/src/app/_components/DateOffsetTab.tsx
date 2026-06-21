"use client";

import { formatDate, ko } from "@1-blue/libs";
import { Badge } from "@1-blue/ui/components/badge";
import { Button } from "@1-blue/ui/components/button";
import { Card, CardContent } from "@1-blue/ui/components/card";
import { Input } from "@1-blue/ui/components/input";
import { Label } from "@1-blue/ui/components/label";
import { ToggleGroup, ToggleGroupItem } from "@1-blue/ui/components/toggle-group";
import { DatePickerField } from "@/app/_components/DatePickerField";
import { useDateOffset } from "@/app/_hooks/useDateOffset";
import { DATE_OFFSET_PRESETS } from "@/app/_types/date-calculator";

export const DateOffsetTab = () => {
  const {
    baseDate,
    setBaseDate,
    direction,
    setDirection,
    dayCount,
    setDayCount,
    resultDate,
    calculate,
    setPresetDays,
  } = useDateOffset();

  const parsedDays = Number.parseInt(dayCount, 10);
  const explanation =
    resultDate && baseDate && !Number.isNaN(parsedDays)
      ? `기준일 ${formatDate(baseDate, "yyyy년 M월 d일", ko)}에서 ${parsedDays}일 ${direction === "after" ? "후" : "전"}`
      : null;

  return (
    <div className="space-y-4">
      <Card className="border-0 bg-[#f5f5f5] shadow-none">
        <CardContent className="space-y-4 pt-6">
          <h2 className="text-lg font-semibold">N일 후·전 날짜 계산</h2>
          <DatePickerField id="base-date" label="기준일" value={baseDate} onChange={setBaseDate} />
          <div className="space-y-2">
            <Label>더하기/빼기</Label>
            <ToggleGroup
              type="single"
              value={direction}
              onValueChange={(value) => {
                if (value === "after" || value === "before") {
                  setDirection(value);
                }
              }}
              variant="outline"
              className="w-full"
            >
              <ToggleGroupItem
                value="after"
                className="flex-1 data-[state=on]:bg-[#111111] data-[state=on]:text-white data-[state=on]:hover:bg-[#242424] data-[state=on]:hover:text-white"
              >
                일 후
              </ToggleGroupItem>
              <ToggleGroupItem
                value="before"
                className="flex-1 data-[state=on]:bg-[#111111] data-[state=on]:text-white data-[state=on]:hover:bg-[#242424] data-[state=on]:hover:text-white"
              >
                일 전
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="day-count">일 수</Label>
            <div className="flex items-center gap-2">
              <Input
                id="day-count"
                type="number"
                min={0}
                inputMode="numeric"
                value={dayCount}
                onChange={(e) => setDayCount(e.target.value)}
                className="h-11"
              />
              <span className="text-muted-foreground shrink-0 text-sm">일</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {DATE_OFFSET_PRESETS.map((preset) => (
              <Badge
                key={preset}
                variant="secondary"
                className="cursor-pointer px-3 py-1"
                onClick={() => setPresetDays(preset)}
              >
                {preset}일
              </Badge>
            ))}
          </div>
          <Button
            type="button"
            className="h-11 w-full bg-[#111111] text-white hover:bg-[#242424]"
            onClick={calculate}
          >
            날짜 계산하기
          </Button>
        </CardContent>
      </Card>

      {resultDate && (
        <Card className="border shadow-sm">
          <CardContent className="space-y-2 pt-6 text-center">
            <p className="text-3xl font-semibold tracking-tight">
              {formatDate(resultDate, "yyyy년 M월 d일 (EEE)", ko)}
            </p>
            {explanation && <p className="text-muted-foreground text-sm">{explanation}</p>}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
