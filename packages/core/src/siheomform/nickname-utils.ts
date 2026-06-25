/** 동일 CBT 내 닉네임 충돌 시 #001 형식 접미사 부여 */
export const resolveDisplayNickname = (baseNickname: string, existingNicknames: string[]): string => {
  const base = baseNickname.trim();
  if (!base) {
    return base;
  }

  const taken = new Set(existingNicknames);
  if (!taken.has(base)) {
    return base;
  }

  const suffixPattern = new RegExp(`^${escapeRegExp(base)}#(\\d{3})$`);
  const usedNumbers = new Set<number>();

  for (const name of existingNicknames) {
    if (name === base) {
      usedNumbers.add(0);
      continue;
    }
    const match = name.match(suffixPattern);
    if (match?.[1]) {
      usedNumbers.add(Number.parseInt(match[1], 10));
    }
  }

  let n = 1;
  while (usedNumbers.has(n)) {
    n += 1;
  }

  return `${base}#${String(n).padStart(3, "0")}`;
};

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
