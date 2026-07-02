import { addDays, differenceInCalendarDays, startOfDay } from "@1-blue/libs";

export const normalizeDate = (date: Date): Date => startOfDay(date);

export type CountDaysBetweenOptions = {
  includeStart?: boolean;
};

export const countDaysBetween = (
  start: Date,
  end: Date,
  options: CountDaysBetweenOptions = {},
): number => {
  const normalizedStart = normalizeDate(start);
  const normalizedEnd = normalizeDate(end);
  const diff = differenceInCalendarDays(normalizedEnd, normalizedStart);

  if (!options.includeStart) {
    return diff;
  }

  if (diff === 0) {
    return 1;
  }

  return diff > 0 ? diff + 1 : diff - 1;
};

export const addCalendarDays = (base: Date, days: number): Date => {
  return addDays(normalizeDate(base), days);
};
