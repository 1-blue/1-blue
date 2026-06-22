import { MAX_DAILY_STROKES, MAX_STROKES_PER_MINUTE } from "./stroke-types";

export type RateLimitContext = {
  boardStrokeCount: number;
  sessionStrokesLastMinute: number;
};

export const checkRateLimits = (context: RateLimitContext): void => {
  if (context.boardStrokeCount >= MAX_DAILY_STROKES) {
    throw new Error("daily_cap_exceeded");
  }

  if (context.sessionStrokesLastMinute >= MAX_STROKES_PER_MINUTE) {
    throw new Error("rate_limit_exceeded");
  }
};
