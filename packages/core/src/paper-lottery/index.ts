import { z } from "zod";

export type PrizeConfigItem = {
  label: string;
  count: number;
};

export type ParticipantInput = {
  displayName: string;
  pickQuota: number;
};

export type BoardInput = {
  title: string;
  slotCount: number;
  prizeConfig: PrizeConfigItem[];
  participants: ParticipantInput[];
};

export type PrizeRemainder = {
  label: string;
  total: number;
  taken: number;
  remaining: number;
};

export type ParticipantProgress = {
  pickQuota: number;
  picksUsed: number;
};

const SHORT_CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const MIN_SLOTS = 6;
const MAX_SLOTS = 120;

export const boardInputSchema = z.object({
  title: z.string().max(100).default(""),
  slotCount: z.number().int().min(MIN_SLOTS).max(MAX_SLOTS),
  prizeConfig: z
    .array(
      z.object({
        label: z.string().min(1).max(50),
        count: z.number().int().min(0),
      }),
    )
    .min(1),
  participants: z
    .array(
      z.object({
        displayName: z.string().min(1).max(30),
        pickQuota: z.number().int().min(1),
      }),
    )
    .min(1),
});

export const validateBoardInput = (input: BoardInput): BoardInput => {
  const parsed = boardInputSchema.parse(input);
  const prizeTotal = parsed.prizeConfig.reduce((sum, item) => sum + item.count, 0);

  if (prizeTotal !== parsed.slotCount) {
    throw new Error("prize_count_mismatch");
  }

  return parsed;
};

export const buildPrizePool = (prizeConfig: PrizeConfigItem[]): string[] => {
  const pool: string[] = [];

  for (const item of prizeConfig) {
    for (let i = 0; i < item.count; i += 1) {
      pool.push(item.label);
    }
  }

  return pool;
};

export const shuffleSlots = <T>(items: T[], random: () => number = Math.random): T[] => {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j]!, result[i]!];
  }

  return result;
};

export const computePrizeRemainders = (
  prizeConfig: PrizeConfigItem[],
  takenByLabel: Record<string, number> = {},
): PrizeRemainder[] => {
  return prizeConfig.map((item) => {
    const taken = takenByLabel[item.label] ?? 0;
    return {
      label: item.label,
      total: item.count,
      taken,
      remaining: Math.max(0, item.count - taken),
    };
  });
};

export const isBoardComplete = (participants: ParticipantProgress[]): boolean => {
  if (participants.length === 0) {
    return false;
  }

  const totalQuota = participants.reduce((sum, p) => sum + p.pickQuota, 0);
  const totalUsed = participants.reduce((sum, p) => sum + p.picksUsed, 0);

  return totalUsed >= totalQuota;
};

export const generateShortCode = (length = 6, random: () => number = Math.random): string => {
  let code = "";

  for (let i = 0; i < length; i += 1) {
    const index = Math.floor(random() * SHORT_CODE_CHARS.length);
    code += SHORT_CODE_CHARS[index];
  }

  return code;
};

export const generateSecureToken = (bytes = 24): string => {
  const array = new Uint8Array(bytes);

  for (let i = 0; i < bytes; i += 1) {
    array[i] = Math.floor(Math.random() * 256);
  }

  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
};

export const DEFAULT_PRIZE_PRESET = (slotCount: number): PrizeConfigItem[] => {
  const first = Math.max(1, Math.floor(slotCount * 0.05));
  const second = Math.max(1, Math.floor(slotCount * 0.1));
  const third = Math.max(1, Math.floor(slotCount * 0.15));
  const used = first + second + third;
  const miss = Math.max(0, slotCount - used);

  return [
    { label: "1등", count: first },
    { label: "2등", count: second },
    { label: "3등", count: third },
    { label: "꽝", count: miss },
  ];
};
