export const KST_TIMEZONE = "Asia/Seoul";

export const getKstBoardDate = (now: Date = new Date()): string => {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: KST_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
};

export const formatKstDateLabel = (boardDate: string): string => {
  const [year, month, day] = boardDate.split("-").map(Number);

  if (!year || !month || !day) {
    return boardDate;
  }

  return `${year}년 ${month}월 ${day}일`;
};

export const formatKstDateShort = (boardDate: string): string => {
  const [, month, day] = boardDate.split("-").map(Number);

  if (!month || !day) {
    return boardDate;
  }

  return `${month}월 ${day}일`;
};

export const isValidBoardDate = (value: string): boolean => {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
};

export const getYesterdayBoardDate = (now: Date = new Date()): string => {
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  return getKstBoardDate(yesterday);
};
