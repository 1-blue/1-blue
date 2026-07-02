"use client";

import type { CbtMetadata } from "@/core";
import { Button } from "@1-blue/ui/components/button";
import { Input } from "@1-blue/ui/components/input";
import { Label } from "@1-blue/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@1-blue/ui/components/select";
import { Switch } from "@1-blue/ui/components/switch";
import { Textarea } from "@1-blue/ui/components/textarea";
import { ImageUploadField } from "@/app/_components/editor/ImageUploadField";

const TIME_OPTIONS = [0, 30, 45, 60, 90, 120];

type CbtMetadataFormProps = {
  metadata: CbtMetadata;
  onChange: (patch: Partial<CbtMetadata>) => void;
  onContinue?: () => void;
  showContinue?: boolean;
};

export const CbtMetadataForm = ({
  metadata,
  onChange,
  onContinue,
  showContinue = false,
}: CbtMetadataFormProps) => {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="cbt-title">
          제목 <span className="text-destructive">*</span>
        </Label>
        <Input
          id="cbt-title"
          placeholder="2026 정보처리기사 모의고사"
          value={metadata.title}
          onChange={(e) => onChange({ title: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cbt-desc">설명</Label>
        <Textarea
          id="cbt-desc"
          placeholder="실전과 동일한 환경에서 풀어보세요."
          rows={3}
          value={metadata.description ?? ""}
          onChange={(e) => onChange({ description: e.target.value || null })}
        />
      </div>

      <ImageUploadField
        label="커버 이미지"
        value={metadata.coverImageUrl}
        onChange={(url) => onChange({ coverImageUrl: url })}
      />

      <div className="space-y-2">
        <Label>시간 제한</Label>
        <Select
          value={String(metadata.timeLimitMinutes ?? 0)}
          onValueChange={(value) => onChange({ timeLimitMinutes: Number(value) || null })}
        >
          <SelectTrigger>
            <SelectValue placeholder="시간 선택" />
          </SelectTrigger>
          <SelectContent>
            {TIME_OPTIONS.map((minutes) => (
              <SelectItem key={minutes} value={String(minutes)}>
                {minutes === 0 ? "없음" : `${minutes}분`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="shuffle-q">문제 순서 랜덤</Label>
          <Switch
            id="shuffle-q"
            checked={metadata.shuffleQuestions}
            onCheckedChange={(checked) => onChange({ shuffleQuestions: checked })}
          />
        </div>
        <div className="flex items-center justify-between gap-3">
          <div>
            <Label htmlFor="show-exp">결과 공개</Label>
            <p className="text-muted-foreground text-xs">제출 후 정답·해설 표시</p>
          </div>
          <Switch
            id="show-exp"
            checked={metadata.showExplanation}
            onCheckedChange={(checked) => onChange({ showExplanation: checked })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="total-points">시험 총점</Label>
        <div className="flex items-center gap-2">
          <Input
            id="total-points"
            type="number"
            min={1}
            max={1000}
            value={metadata.totalPoints}
            onChange={(e) => onChange({ totalPoints: Number(e.target.value) || 100 })}
            className="w-24"
          />
          <span className="text-muted-foreground text-sm">점</span>
        </div>
        <p className="text-muted-foreground text-xs">미지정 문항 배점은 자동 분배됩니다.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="passing-score">합격 기준 점수</Label>
        <div className="flex items-center gap-2">
          <Input
            id="passing-score"
            type="number"
            min={0}
            max={100}
            value={metadata.passingScore}
            onChange={(e) => onChange({ passingScore: Number(e.target.value) || 0 })}
            className="w-24"
          />
          <span className="text-muted-foreground text-sm">점</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label>공개 여부</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant={metadata.isPublic ? "outline" : "default"}
            onClick={() => onChange({ isPublic: false })}
          >
            비공개
          </Button>
          <Button
            type="button"
            variant={metadata.isPublic ? "default" : "outline"}
            onClick={() => onChange({ isPublic: true })}
          >
            공개
          </Button>
        </div>
      </div>

      {showContinue && onContinue && (
        <Button type="button" className="w-full" onClick={onContinue}>
          문제 작성하기 →
        </Button>
      )}
    </div>
  );
};
