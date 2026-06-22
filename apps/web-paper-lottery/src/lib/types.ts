import type { PrizeConfigItem, PrizeRemainder } from "@1-blue/core/paper-lottery";

export type SlotView = {
  index: number;
  taken: boolean;
  pickedByName?: string;
  prizeLabel?: string;
};

export type OwnPick = {
  slotIndex: number;
  prizeLabel: string;
  pickedAt: string;
};

export type ParticipantView = {
  picksUsed: number;
  pickQuota: number;
  ownPicks: OwnPick[];
};

export type ParticipantAdminView = {
  id: string;
  displayName: string;
  token: string;
  pickQuota: number;
  picksUsed: number;
};

export type BoardView = {
  shortCode: string;
  title: string;
  slotCount: number;
  status: "active" | "closed";
  revealed: boolean;
  revealedAt: string | null;
  expiresAt: string;
  prizeConfig: PrizeConfigItem[];
  prizeRemainders: PrizeRemainder[];
  slots: SlotView[];
  progress: {
    totalQuota: number;
    totalUsed: number;
    percent: number;
  };
};

export type PrizeWinner = {
  slotIndex: number;
  displayName: string;
  pickedAt?: string;
};

export type AdminBoardView = BoardView & {
  adminToken: string;
  participants: ParticipantAdminView[];
  prizeWinnersByLabel: Record<string, PrizeWinner[]>;
};

export type PlayBoardView = BoardView & {
  participant: ParticipantView;
};

export type CreateBoardResponse = {
  shortCode: string;
  adminToken: string;
  adminUrl: string;
};

export type PickResponse = {
  prizeLabel: string;
  revealed: boolean;
  board: PlayBoardView;
};
