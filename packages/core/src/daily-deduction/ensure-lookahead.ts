import { getKstPuzzleDate, getPuzzleDateRange } from "./kst-date";

export const LOOKAHEAD_DAYS = 3;

export const getLookaheadDates = (now: Date = new Date()): string[] => {
  const today = getKstPuzzleDate(now);
  return getPuzzleDateRange(today, LOOKAHEAD_DAYS);
};

export type EnsureLookaheadDeps = {
  getExistingDates: () => Promise<string[]>;
  generateForDate: (date: string) => Promise<void>;
};

export const ensureLookahead = async (
  deps: EnsureLookaheadDeps,
): Promise<{ generated: string[]; skipped: string[] }> => {
  const targetDates = getLookaheadDates();
  const existing = new Set(await deps.getExistingDates());
  const generated: string[] = [];
  const skipped: string[] = [];

  for (const date of targetDates) {
    if (existing.has(date)) {
      skipped.push(date);
      continue;
    }
    await deps.generateForDate(date);
    generated.push(date);
    existing.add(date);
  }

  return { generated, skipped };
};
