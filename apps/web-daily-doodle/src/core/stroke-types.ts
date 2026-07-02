export const CANVAS_WIDTH = 1200;
export const CANVAS_HEIGHT = 800;

export const PEN_COLORS = [
  "#3D2914",
  "#E85D4C",
  "#F4A261",
  "#2A9D8F",
  "#457B9D",
  "#9B5DE5",
  "#F72585",
  "#FFD60A",
] as const;

export const TEXT_FONTS = ["hand", "sans", "serif"] as const;

export type TextFont = (typeof TEXT_FONTS)[number];

export type Point = [number, number] | [number, number, number];

export type PenStrokeInput = {
  tool: "pen";
  color: string;
  width: number;
  points: Point[];
};

export type TextStrokeInput = {
  tool: "text";
  color: string;
  textContent: string;
  fontFamily: TextFont;
  fontSize?: number;
  x: number;
  y: number;
};

export type StrokeInput = PenStrokeInput | TextStrokeInput;

export type StrokeRecord = StrokeInput & {
  id: string;
  sessionId: string;
  nickname: string;
  createdAt: string;
};

export const MIN_PEN_WIDTH = 1;
export const MAX_PEN_WIDTH = 24;
export const MAX_POINTS_PER_STROKE = 500;
export const MAX_TEXT_LENGTH = 300;
export const MAX_TEXT_LINES = 8;
export const MIN_FONT_SIZE = 16;
export const MAX_FONT_SIZE = 72;
export const DEFAULT_FONT_SIZE = 28;
export const MAX_STROKES_PER_MINUTE = 30;
export const MAX_DAILY_STROKES = 40_000;
export const MAX_UNDO_STACK = 20;

export const MIN_NICKNAME_LENGTH = 2;
export const MAX_NICKNAME_LENGTH = 12;
