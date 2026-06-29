export const KST_TIMEZONE = "Asia/Seoul";

export const getKstToday = (): string => {
  return new Intl.DateTimeFormat("en-CA", { timeZone: KST_TIMEZONE }).format(new Date());
};

export const getKstDaysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return new Intl.DateTimeFormat("en-CA", { timeZone: KST_TIMEZONE }).format(date);
};

export const formatRelativeTime = (iso: string): string => {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) {
    return "방금 전";
  }
  if (minutes < 60) {
    return `${minutes}분 전`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}시간 전`;
  }
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
};
