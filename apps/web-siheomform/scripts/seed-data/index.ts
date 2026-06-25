import type { SeedCbtEntry } from "./build";
import { dailyLifeQuiz } from "./daily-life-quiz";
import { frontendCs } from "./frontend-cs";
import { kDramaOtt } from "./k-drama-ott";
import { koreanHistory } from "./korean-history";
import { kpopHits } from "./kpop-hits";
import { lolWorlds2025 } from "./lol-worlds-2025";
import { sportsTrivia } from "./sports-trivia";

export const SEED_CBTS: SeedCbtEntry[] = [
  lolWorlds2025,
  koreanHistory,
  frontendCs,
  kpopHits,
  kDramaOtt,
  sportsTrivia,
  dailyLifeQuiz,
];
