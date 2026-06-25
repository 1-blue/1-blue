export type MyCbtEntry = {
  adminToken: string;
  publicId: string;
  title: string;
  questionCount: number;
  updatedAt: string;
};

const STORAGE_KEY = "siheomform:my-cbts";

export const getMyCbts = (): MyCbtEntry[] => {
  if (typeof window === "undefined") {
    return [];
  }
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw) as MyCbtEntry[];
  } catch {
    return [];
  }
};

export const addMyCbt = (entry: MyCbtEntry) => {
  const list = getMyCbts().filter((item) => item.adminToken !== entry.adminToken);
  list.unshift(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 20)));
};

export const removeMyCbt = (adminToken: string) => {
  const list = getMyCbts().filter((item) => item.adminToken !== adminToken);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
};
