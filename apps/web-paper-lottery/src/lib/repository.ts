import {
  buildPrizePool,
  computePrizeRemainders,
  generateSecureToken,
  generateShortCode,
  shuffleSlots,
  validateBoardInput,
  type BoardInput,
  type PrizeConfigItem,
} from "@1-blue/core/paper-lottery";
import { getDb } from "./db";
import type {
  AdminBoardView,
  BoardView,
  CreateBoardResponse,
  OwnPick,
  ParticipantAdminView,
  PlayBoardView,
  PrizeWinner,
  SlotView,
} from "./types";

type DbBoard = {
  id: string;
  short_code: string;
  admin_token: string;
  title: string;
  slot_count: number;
  prize_config: unknown;
  status: "active" | "closed";
  revealed_at: string | null;
  expires_at: string;
};

type DbParticipant = {
  id: string;
  board_id: string;
  token: string;
  display_name: string;
  pick_quota: number;
  picks_used: number;
};

type DbSlot = {
  id: string;
  board_id: string;
  slot_index: number;
  prize_label: string;
  picked_by: string | null;
  picked_at: string | null;
};

type DbPick = {
  id: string;
  participant_id: string;
  slot_id: string;
  prize_label: string;
  picked_at: string;
};

const parsePrizeConfig = (value: unknown): PrizeConfigItem[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is PrizeConfigItem => {
      return (
        typeof item === "object" &&
        item !== null &&
        "label" in item &&
        "count" in item &&
        typeof item.label === "string" &&
        typeof item.count === "number"
      );
    })
    .map((item) => ({ label: item.label, count: item.count }));
};

const getSiteUrl = (): string => {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:7002";
};

type BuildSlotViewsOptions = {
  revealPrizes?: boolean;
};

const buildSlotViews = (
  slots: DbSlot[],
  participants: DbParticipant[],
  revealed: boolean,
  options: BuildSlotViewsOptions = {},
): SlotView[] => {
  const { revealPrizes = revealed } = options;
  const nameById = new Map(participants.map((p) => [p.id, p.display_name]));

  return slots
    .slice()
    .sort((a, b) => a.slot_index - b.slot_index)
    .map((slot) => {
      const view: SlotView = {
        index: slot.slot_index,
        taken: slot.picked_by !== null,
      };

      if (slot.picked_by) {
        view.pickedByName = nameById.get(slot.picked_by) ?? "알 수 없음";
      }

      if (revealPrizes) {
        view.prizeLabel = slot.prize_label;
      }

      return view;
    });
};

const buildPrizeWinnersByLabel = (
  slots: DbSlot[],
  participants: DbParticipant[],
): Record<string, PrizeWinner[]> => {
  const nameById = new Map(participants.map((p) => [p.id, p.display_name]));
  const winners: Record<string, PrizeWinner[]> = {};

  for (const slot of slots) {
    if (!slot.picked_by) {
      continue;
    }

    const entry = {
      slotIndex: slot.slot_index,
      displayName: nameById.get(slot.picked_by) ?? "알 수 없음",
      pickedAt: slot.picked_at ?? undefined,
    };

    const label = slot.prize_label;
    if (!winners[label]) {
      winners[label] = [];
    }

    winners[label]!.push(entry);
  }

  for (const label of Object.keys(winners)) {
    winners[label]!.sort((a, b) => a.slotIndex - b.slotIndex);
  }

  return winners;
};

const buildBoardView = (
  board: DbBoard,
  participants: DbParticipant[],
  slots: DbSlot[],
  options: BuildSlotViewsOptions = {},
): BoardView => {
  const prizeConfig = parsePrizeConfig(board.prize_config);
  const revealed = board.revealed_at !== null;
  const takenByLabel: Record<string, number> = {};

  for (const slot of slots) {
    if (slot.picked_by) {
      takenByLabel[slot.prize_label] = (takenByLabel[slot.prize_label] ?? 0) + 1;
    }
  }

  const totalQuota = participants.reduce((sum, p) => sum + p.pick_quota, 0);
  const totalUsed = participants.reduce((sum, p) => sum + p.picks_used, 0);

  return {
    shortCode: board.short_code,
    title: board.title,
    slotCount: board.slot_count,
    status: board.status,
    revealed,
    revealedAt: board.revealed_at,
    expiresAt: board.expires_at,
    prizeConfig,
    prizeRemainders: computePrizeRemainders(prizeConfig, takenByLabel),
    slots: buildSlotViews(slots, participants, revealed, options),
    progress: {
      totalQuota,
      totalUsed,
      percent: totalQuota > 0 ? Math.round((totalUsed / totalQuota) * 100) : 0,
    },
  };
};

const fetchBoardBundle = async (shortCode: string) => {
  const db = getDb();

  const { data: board, error: boardError } = await db
    .from("boards")
    .select("*")
    .eq("short_code", shortCode)
    .single();

  if (boardError || !board) {
    return null;
  }

  const typedBoard = board as DbBoard;

  const [{ data: participants }, { data: slots }] = await Promise.all([
    db.from("participants").select("*").eq("board_id", typedBoard.id),
    db.from("slots").select("*").eq("board_id", typedBoard.id),
  ]);

  return {
    board: typedBoard,
    participants: (participants ?? []) as DbParticipant[],
    slots: (slots ?? []) as DbSlot[],
  };
};

export const createBoard = async (input: BoardInput): Promise<CreateBoardResponse> => {
  const validated = validateBoardInput(input);
  const db = getDb();
  const prizePool = shuffleSlots(buildPrizePool(validated.prizeConfig));

  let shortCode = generateShortCode();
  let attempts = 0;

  while (attempts < 5) {
    const { data: existing } = await db
      .from("boards")
      .select("id")
      .eq("short_code", shortCode)
      .maybeSingle();

    if (!existing) {
      break;
    }

    shortCode = generateShortCode();
    attempts += 1;
  }

  const adminToken = generateSecureToken();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data: board, error: boardError } = await db
    .from("boards")
    .insert({
      short_code: shortCode,
      admin_token: adminToken,
      title: validated.title,
      slot_count: validated.slotCount,
      prize_config: validated.prizeConfig,
      expires_at: expiresAt,
    })
    .select("*")
    .single();

  if (boardError || !board) {
    throw new Error(boardError?.message ?? "board_create_failed");
  }

  const typedBoard = board as DbBoard;

  const participantRows = validated.participants.map((p) => ({
    board_id: typedBoard.id,
    token: generateSecureToken(),
    display_name: p.displayName,
    pick_quota: p.pickQuota,
  }));

  const { error: participantError } = await db.from("participants").insert(participantRows);

  if (participantError) {
    throw new Error(participantError.message);
  }

  const slotRows = prizePool.map((label, index) => ({
    board_id: typedBoard.id,
    slot_index: index,
    prize_label: label,
  }));

  const { error: slotError } = await db.from("slots").insert(slotRows);

  if (slotError) {
    throw new Error(slotError.message);
  }

  const siteUrl = getSiteUrl();

  return {
    shortCode,
    adminToken,
    adminUrl: `${siteUrl}/b/${shortCode}/admin?token=${adminToken}`,
  };
};

export const getBoardForAdmin = async (
  shortCode: string,
  adminToken: string,
): Promise<AdminBoardView | null> => {
  const bundle = await fetchBoardBundle(shortCode);

  if (!bundle || bundle.board.admin_token !== adminToken) {
    return null;
  }

  const base = buildBoardView(bundle.board, bundle.participants, bundle.slots, {
    revealPrizes: true,
  });
  const participants: ParticipantAdminView[] = bundle.participants.map((p) => ({
    id: p.id,
    displayName: p.display_name,
    token: p.token,
    pickQuota: p.pick_quota,
    picksUsed: p.picks_used,
  }));

  return {
    ...base,
    adminToken: bundle.board.admin_token,
    participants,
    prizeWinnersByLabel: buildPrizeWinnersByLabel(bundle.slots, bundle.participants),
  };
};

const buildOwnPicks = (participantId: string, picks: DbPick[], slots: DbSlot[]): OwnPick[] => {
  const slotIndexById = new Map(slots.map((s) => [s.id, s.slot_index]));

  return picks
    .filter((pick) => pick.participant_id === participantId)
    .map((pick) => ({
      slotIndex: slotIndexById.get(pick.slot_id) ?? -1,
      prizeLabel: pick.prize_label,
      pickedAt: pick.picked_at,
    }))
    .sort((a, b) => a.slotIndex - b.slotIndex);
};

export const getBoardForPlay = async (
  shortCode: string,
  participantToken: string,
): Promise<PlayBoardView | null> => {
  const bundle = await fetchBoardBundle(shortCode);

  if (!bundle) {
    return null;
  }

  const participant = bundle.participants.find((p) => p.token === participantToken);

  if (!participant) {
    return null;
  }

  const db = getDb();
  const { data: picks } = await db.from("picks").select("*").eq("participant_id", participant.id);

  const base = buildBoardView(bundle.board, bundle.participants, bundle.slots);

  return {
    ...base,
    participant: {
      picksUsed: participant.picks_used,
      pickQuota: participant.pick_quota,
      ownPicks: buildOwnPicks(participant.id, (picks ?? []) as DbPick[], bundle.slots),
    },
  };
};

export const pickSlot = async (
  shortCode: string,
  participantToken: string,
  slotIndex: number,
): Promise<{ prizeLabel: string; revealed: boolean; board: PlayBoardView }> => {
  const db = getDb();

  const { data, error } = await db.rpc("pick_slot", {
    p_participant_token: participantToken,
    p_slot_index: slotIndex,
  });

  if (error) {
    throw new Error(error.message);
  }

  const row = Array.isArray(data) ? data[0] : data;

  if (!row || typeof row !== "object" || !("prize_label" in row)) {
    throw new Error("pick_failed");
  }

  const board = await getBoardForPlay(shortCode, participantToken);

  if (!board) {
    throw new Error("board_not_found");
  }

  return {
    prizeLabel: String(row.prize_label),
    revealed: Boolean(row.revealed),
    board,
  };
};

export const closeBoard = async (
  shortCode: string,
  adminToken: string,
): Promise<BoardView | null> => {
  const bundle = await fetchBoardBundle(shortCode);

  if (!bundle || bundle.board.admin_token !== adminToken) {
    return null;
  }

  const db = getDb();

  const { error } = await db
    .from("boards")
    .update({
      status: "closed",
      revealed_at: bundle.board.revealed_at ?? new Date().toISOString(),
    })
    .eq("id", bundle.board.id);

  if (error) {
    throw new Error(error.message);
  }

  const updated = await fetchBoardBundle(shortCode);

  if (!updated) {
    return null;
  }

  return buildBoardView(updated.board, updated.participants, updated.slots);
};

export const getBoardForResult = async (shortCode: string): Promise<BoardView | null> => {
  const bundle = await fetchBoardBundle(shortCode);

  if (!bundle || !bundle.board.revealed_at) {
    return null;
  }

  return buildBoardView(bundle.board, bundle.participants, bundle.slots);
};

export const getParticipantPlayUrl = (shortCode: string, participantToken: string): string => {
  return `${getSiteUrl()}/b/${shortCode}/play?token=${participantToken}`;
};
