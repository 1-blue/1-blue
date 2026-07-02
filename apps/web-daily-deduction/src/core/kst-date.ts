export const KST_TIMEZONE = "Asia/Seoul";

export const getKstPuzzleDate = (now: Date = new Date()): string => {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: KST_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
};

export const formatKstDateLabel = (puzzleDate: string): string => {
  const [year, month, day] = puzzleDate.split("-").map(Number);

  if (!year || !month || !day) {
    return puzzleDate;
  }

  return `${year}년 ${month}월 ${day}일`;
};

export const formatKstDateShort = (puzzleDate: string): string => {
  const [, month, day] = puzzleDate.split("-").map(Number);

  if (!month || !day) {
    return puzzleDate;
  }

  return `${month}월 ${day}일`;
};

export const isValidPuzzleDate = (value: string): boolean => {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
};

export const addDaysToPuzzleDate = (puzzleDate: string, days: number): string => {
  const parts = puzzleDate.split("-").map(Number);
  const year = parts[0] ?? 0;
  const month = parts[1] ?? 1;
  const day = parts[2] ?? 1;
  const utc = Date.UTC(year, month - 1, day + days);
  const d = new Date(utc);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
};

export const getPuzzleDateRange = (startDate: string, count: number): string[] => {
  return Array.from({ length: count }, (_, i) => addDaysToPuzzleDate(startDate, i));
};
