import { format, isValid, parseISO } from "date-fns";
import { ko as koLocale } from "date-fns/locale";

export { addDays, endOfDay, format, isValid, parseISO, startOfDay, subDays } from "date-fns";
export { ko } from "date-fns/locale";

export const formatDate = (
  date: Date | string | number,
  pattern = "yyyy-MM-dd",
  locale = koLocale,
): string => {
  const value = typeof date === "string" ? parseISO(date) : new Date(date);
  if (!isValid(value)) return "";
  return format(value, pattern, { locale });
};

export const formatDateTime = (date: Date | string | number): string => {
  return formatDate(date, "yyyy-MM-dd HH:mm");
};
