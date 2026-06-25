"use client";

import type { CbtMetadata } from "@1-blue/core/siheomform";
import { Label } from "@1-blue/ui/components/label";
import { Switch } from "@1-blue/ui/components/switch";
import { CbtMetadataForm } from "@/app/create/_components/editor/CbtMetadataForm";

type BasicSettingsSidebarProps = {
  metadata: CbtMetadata;
  onChange: (patch: Partial<CbtMetadata>) => void;
};

export const BasicSettingsSidebar = ({ metadata, onChange }: BasicSettingsSidebarProps) => {
  return (
    <aside className="editor-sidebar surface-card h-fit space-y-5 p-4">
      <div>
        <h2 className="text-sm font-semibold">기본 설정</h2>
        <p className="text-muted-foreground mt-1 text-xs">시험 메타데이터</p>
      </div>

      <CbtMetadataForm metadata={metadata} onChange={onChange} />

      <div className="space-y-3 border-t pt-3">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="shuffle-c">보기 순서 섞기</Label>
          <Switch
            id="shuffle-c"
            checked={metadata.shuffleChoices}
            onCheckedChange={(checked) => onChange({ shuffleChoices: checked })}
          />
        </div>
      </div>
    </aside>
  );
};
