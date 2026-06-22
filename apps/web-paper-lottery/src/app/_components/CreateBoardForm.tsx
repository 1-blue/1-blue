"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DEFAULT_PRIZE_PRESET,
  type BoardInput,
  type ParticipantInput,
  type PrizeConfigItem,
} from "@1-blue/core/paper-lottery";
import { Button } from "@1-blue/ui/components/button";
import { Input } from "@1-blue/ui/components/input";
import { Label } from "@1-blue/ui/components/label";
import { ParticipantRowEditor } from "@/app/_components/ParticipantRowEditor";
import { PrizeConfigEditor } from "@/app/_components/PrizeConfigEditor";

const DEFAULT_SLOT_COUNT = 30;

export const CreateBoardForm = () => {
  const router = useRouter();
  const [title, setTitle] = useState("우리 반 뽑기");
  const [slotCount, setSlotCount] = useState(DEFAULT_SLOT_COUNT);
  const [prizeConfig, setPrizeConfig] = useState<PrizeConfigItem[]>(
    DEFAULT_PRIZE_PRESET(DEFAULT_SLOT_COUNT),
  );
  const [participants, setParticipants] = useState<ParticipantInput[]>([
    { displayName: "철수", pickQuota: 1 },
    { displayName: "영희", pickQuota: 1 },
    { displayName: "참가자 3", pickQuota: 1 },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSlotCountChange = (next: number) => {
    setSlotCount(next);
    setPrizeConfig(DEFAULT_PRIZE_PRESET(next));
  };

  const handleSubmit = async () => {
    setError(null);
    setSubmitting(true);

    const body: BoardInput = {
      title,
      slotCount,
      prizeConfig,
      participants,
    };

    try {
      const res = await fetch("/api/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = (await res.json()) as { adminUrl?: string; error?: string };

      if (!res.ok || !data.adminUrl) {
        setError(data.error ?? "생성에 실패했습니다.");
        return;
      }

      router.push(data.adminUrl);
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="paper-texture space-y-5 rounded-2xl border-2 border-[#d9c4a0] p-5 shadow-md">
      <div className="text-center">
        <span className="bg-wood-dark inline-block rounded-full px-3 py-1 text-xs font-bold tracking-wide text-white">
          SETUP
        </span>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title" className="text-ink/80 text-xs font-bold tracking-wide uppercase">
          뽑기판 이름
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border-[#d9c4a0] bg-white h-11 focus-visible:ring-stamp/30"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slotCount" className="text-ink/80 text-xs font-bold tracking-wide uppercase">
          인원 수 (칸 수)
        </Label>
        <div className="flex items-center gap-2">
          <Input
            id="slotCount"
            type="number"
            min={6}
            max={120}
            value={slotCount}
            onChange={(e) => handleSlotCountChange(Number(e.target.value))}
            className="border-[#d9c4a0] bg-white h-11 w-28 focus-visible:ring-stamp/30"
          />
          <span className="text-ink/60 text-sm font-semibold">명</span>
        </div>
      </div>

      <PrizeConfigEditor value={prizeConfig} slotCount={slotCount} onChange={setPrizeConfig} />
      <ParticipantRowEditor value={participants} onChange={setParticipants} />

      {error && <p className="text-stamp text-center text-sm font-semibold">{error}</p>}

      <Button
        type="button"
        className="bg-stamp hover:bg-stamp/90 h-14 w-full text-lg font-black text-white shadow-md"
        disabled={submitting}
        onClick={() => void handleSubmit()}
      >
        {submitting ? "만드는 중…" : "뽑기판 만들기"}
      </Button>
    </section>
  );
};
