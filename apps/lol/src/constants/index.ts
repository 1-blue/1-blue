const LOCALE = process.env.NEXT_PUBLIC_LOL_API_LOCALE;
const VERSION = process.env.NEXT_PUBLIC_LOL_API_VERSION;

export const LOL_API_ENDPOINT = {
  allChampions: () => `cdn/${VERSION}/data/${LOCALE}/champion.json`,
  championDetail: (id: string) =>
    `cdn/${VERSION}/data/${LOCALE}/champion/${id}.json`,
  championSplashImage: (id: string, skinNum: number = 0) =>
    `cdn/img/champion/splash/${id}_${skinNum}.jpg`,
  championLoadingImage: (id: string, skinNum: number = 0) =>
    `cdn/img/champion/loading/${id}_${skinNum}.jpg`,
  championSquareImage: (id: string) => `cdn/${VERSION}/img/champion/${id}.png`,
  passiveImage: (filename: string) => `cdn/${VERSION}/img/passive/${filename}`,
  spellImage: (filename: string) => `cdn/${VERSION}/img/spell/${filename}`,
};
