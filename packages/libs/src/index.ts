export type QueryValue = string | number | boolean | null | undefined;

export {
  addDays,
  differenceInCalendarDays,
  format,
  formatDate,
  formatDateTime,
  isValid,
  ko,
  parseISO,
  startOfDay,
  subDays,
} from "./date";

export const makeURLQueries = (params: Record<string, QueryValue>): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") return;
    searchParams.set(key, String(value));
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const cn = (...classes: (string | false | null | undefined)[]): string => {
  return classes.filter(Boolean).join(" ");
};
