"use client";

import { useState } from "react";
import Link from "next/link";
import { Link2, QrCode } from "lucide-react";
import type { AdminBoardView } from "@/lib/types";
import { Button } from "@1-blue/ui/components/button";
import { CopyButton } from "@/app/_components/CopyButton";
import { OpenLinkButton } from "@/app/_components/OpenLinkButton";
import { PrizeRemainderBar } from "@/app/_components/PrizeRemainderBar";
import { RevealedBoardGrid } from "@/app/_components/PaperBoardGrid";
import { BoardStatusLegend } from "@/app/_components/BoardStatusLegend";
import { QrCodeCard } from "@/app/_components/QrCodeCard";
import { StitchProgressBar } from "@/app/_components/stitch/StitchProgressBar";

type ParticipantLinkListProps = {
  board: AdminBoardView;
};

const getPlayUrl = (shortCode: string, token: string): string => {
  const base = typeof window !== "undefined" ? window.location.origin : "";
  return `${base}/b/${shortCode}/play?token=${token}`;
};

const getQrApiUrl = (shortCode: string, adminToken: string, participantToken: string): string => {
  return `/api/boards/${shortCode}/qr?adminToken=${encodeURIComponent(adminToken)}&token=${encodeURIComponent(participantToken)}`;
};

export const ParticipantLinkList = ({ board }: ParticipantLinkListProps) => {
  const [qrTarget, setQrTarget] = useState<{ name: string; url: string } | null>(null);

  const allLinks = board.participants
    .map((p) => `${p.displayName}: ${getPlayUrl(board.shortCode, p.token)}`)
    .join("\n");

  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-bold">참여자 리스트</h2>
          <p className="text-ink/60 text-xs">총 {board.participants.length}명 참여</p>
        </div>
      </div>

      {board.participants.map((p) => {
        const playUrl = getPlayUrl(board.shortCode, p.token);
        const qrUrl = getQrApiUrl(board.shortCode, board.adminToken, p.token);
        const isDone = p.picksUsed >= p.pickQuota;

        return (
          <div
            key={p.id}
            className={`paper-texture relative overflow-hidden rounded-xl border-2 border-[#d9c4a0] p-4 ${
              isDone ? "opacity-80" : ""
            }`}
          >
            {isDone && <span className="stamp-done-badge">완료</span>}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-lg font-bold">{p.displayName}</p>
                <p className="text-ink/60 text-sm">
                  {isDone
                    ? `${p.pickQuota}/${p.pickQuota}회 완료`
                    : `${p.picksUsed}/${p.pickQuota}회 사용`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <OpenLinkButton href={playUrl} disabled={isDone} />
                <CopyButton
                  text={playUrl}
                  label=""
                  className="size-10 shrink-0 p-0"
                  disabled={isDone}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="border-[#6b9fd4] bg-[#6b9fd4] h-10 shrink-0 px-3 text-white hover:bg-[#5a8ec3]"
                  disabled={isDone}
                  onClick={() => setQrTarget({ name: p.displayName, url: qrUrl })}
                >
                  <QrCode className="mr-1 size-4" />
                  QR
                </Button>
              </div>
            </div>
          </div>
        );
      })}

      <CopyButton
        text={allLinks}
        label="전체 참가 링크 복사"
        className="bg-stamp hover:bg-stamp/90 h-12 w-full border-0 text-white"
      />

      <QrCodeCard
        open={qrTarget !== null}
        onOpenChange={(open) => !open && setQrTarget(null)}
        title={qrTarget?.name ?? ""}
        qrUrl={qrTarget?.url ?? ""}
      />
    </section>
  );
};

type AdminDashboardProps = {
  board: AdminBoardView;
  onClose: () => Promise<void>;
  closing?: boolean;
};

export const AdminDashboard = ({ board, onClose, closing }: AdminDashboardProps) => {
  const resultUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/b/${board.shortCode}/result`
      : "";

  return (
    <div className="space-y-6">
      <div className="paper-texture space-y-3 rounded-2xl border-2 border-[#d9c4a0] p-5 text-center shadow-sm">
        <div className="flex items-center justify-center gap-2">
          <span className="bg-ink/8 rounded px-2 py-1 font-mono text-sm font-bold tracking-widest">
            {board.shortCode}
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-bold text-white ${
              board.revealed ? "bg-ink/40" : "bg-active"
            }`}
          >
            {board.revealed ? "마감" : "진행 중"}
          </span>
        </div>
        <h1 className="text-2xl font-black">{board.title}</h1>
      </div>

      <StitchProgressBar
        label="진행 상황"
        rightLabel={`${board.progress.totalUsed} / ${board.progress.totalQuota}명 뽑기 완료`}
        percent={board.progress.percent}
      />

      <PrizeRemainderBar
        items={board.prizeRemainders}
        mode="admin"
        prizeWinnersByLabel={board.prizeWinnersByLabel}
      />
      <ParticipantLinkList board={board} />

      <div className="space-y-3">
        {board.revealed ? (
          <Button asChild className="bg-stamp hover:bg-stamp/90 h-12 w-full font-bold text-white">
            <Link href={`/b/${board.shortCode}/result`}>
              <Link2 className="mr-2 size-4" />
              결과 보기
            </Link>
          </Button>
        ) : (
          <>
            {resultUrl && (
              <CopyButton
                text={resultUrl}
                label="결과 링크 복사"
                className="h-11 w-full"
              />
            )}
            <Button
              type="button"
              variant="outline"
              className="border-[#d9c4a0] bg-cream hover:bg-cream/80 h-12 w-full font-bold"
              disabled={closing}
              onClick={() => void onClose()}
            >
              {closing ? "마감 중…" : "수동 마감하기"}
            </Button>
          </>
        )}
      </div>

      {board.revealed && (
        <section className="space-y-3">
          <h2 className="font-bold">전체 보드</h2>
          <BoardStatusLegend />
          <RevealedBoardGrid slots={board.slots} revealed />
        </section>
      )}
    </div>
  );
};
