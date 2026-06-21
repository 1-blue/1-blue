"use client";

import { formatDate, ko } from "@1-blue/libs";
import { Button } from "@1-blue/ui/components/button";
import { Card, CardContent } from "@1-blue/ui/components/card";
import { Label } from "@1-blue/ui/components/label";
import { Switch } from "@1-blue/ui/components/switch";
import { DatePickerField } from "@/app/_components/DatePickerField";
import { useDaysBetween } from "@/app/_hooks/useDaysBetween";

export const DaysBetweenTab = () => {
  const {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    includeStart,
    setIncludeStart,
    days,
    calculate,
  } = useDaysBetween();

  const rangeLabel =
    startDate && endDate
      ? `${formatDate(startDate, "yyyy년 M월 d일", ko)} ~ ${formatDate(endDate, "yyyy년 M월 d일", ko)}`
      : null;

  return (
    <div className="space-y-4">
      <Card className="border-0 bg-[#f5f5f5] shadow-none">
        <CardContent className="space-y-4 pt-6">
          <h2 className="text-lg font-semibold">두 날짜 사이 일수 계산</h2>
          <DatePickerField
            id="start-date"
            label="시작일"
            value={startDate}
            onChange={setStartDate}
          />
          <DatePickerField id="end-date" label="종료일" value={endDate} onChange={setEndDate} />
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="include-start" className="cursor-pointer">
              시작일 포함
            </Label>
            <Switch id="include-start" checked={includeStart} onCheckedChange={setIncludeStart} />
          </div>
          <Button
            type="button"
            className="h-11 w-full bg-[#111111] text-white hover:bg-[#242424]"
            onClick={calculate}
          >
            일수 계산하기
          </Button>
        </CardContent>
      </Card>

      {days !== null && (
        <Card className="border shadow-sm">
          <CardContent className="space-y-2 pt-6 text-center">
            <p className="text-4xl font-semibold tracking-tight">{days}일</p>
            {rangeLabel && <p className="text-muted-foreground text-sm">{rangeLabel}</p>}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
