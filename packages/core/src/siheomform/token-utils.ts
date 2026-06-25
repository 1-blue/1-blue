const randomToken = (length: number): string => {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
};

export const generateAdminToken = (): string => randomToken(16);

export const generatePublicId = (): string => randomToken(12);
