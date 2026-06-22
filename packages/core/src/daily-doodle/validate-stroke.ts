import { z } from "zod";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  DEFAULT_FONT_SIZE,
  MAX_FONT_SIZE,
  MAX_PEN_WIDTH,
  MAX_POINTS_PER_STROKE,
  MAX_TEXT_LENGTH,
  MAX_TEXT_LINES,
  MIN_FONT_SIZE,
  MIN_PEN_WIDTH,
  PEN_COLORS,
  TEXT_FONTS,
  type PenStrokeInput,
  type StrokeInput,
  type TextStrokeInput,
} from "./stroke-types";

const hexColorSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$/);

const pointSchema = z.union([
  z.tuple([z.number(), z.number()]),
  z.tuple([z.number(), z.number(), z.number()]),
]);

const penStrokeSchema = z.object({
  tool: z.literal("pen"),
  color: hexColorSchema,
  width: z.number().min(MIN_PEN_WIDTH).max(MAX_PEN_WIDTH),
  points: z.array(pointSchema).min(1).max(MAX_POINTS_PER_STROKE),
});

const textStrokeSchema = z.object({
  tool: z.literal("text"),
  color: hexColorSchema,
  textContent: z.string().min(1).max(MAX_TEXT_LENGTH),
  fontFamily: z.enum(TEXT_FONTS),
  fontSize: z.number().min(MIN_FONT_SIZE).max(MAX_FONT_SIZE).optional(),
  x: z.number().min(0).max(CANVAS_WIDTH),
  y: z.number().min(0).max(CANVAS_HEIGHT),
});

export const strokeInputSchema = z.discriminatedUnion("tool", [penStrokeSchema, textStrokeSchema]);

const getBboxDiagonal = (points: PenStrokeInput["points"]): number => {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const point of points) {
    const [x, y] = point;
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }

  const width = maxX - minX;
  const height = maxY - minY;
  return Math.hypot(width, height);
};

const canvasDiagonal = Math.hypot(CANVAS_WIDTH, CANVAS_HEIGHT);

export const validateStrokeInput = (input: unknown): StrokeInput => {
  const parsed = strokeInputSchema.parse(input);

  if (!PEN_COLORS.includes(parsed.color as (typeof PEN_COLORS)[number])) {
    throw new Error("invalid_color");
  }

  if (parsed.tool === "pen") {
    const diagonal = getBboxDiagonal(parsed.points);

    if (diagonal > canvasDiagonal * 0.8) {
      throw new Error("stroke_too_large");
    }
  }

  if (parsed.tool === "text") {
    const lineCount = parsed.textContent.split("\n").length;

    if (lineCount > MAX_TEXT_LINES) {
      throw new Error("text_too_many_lines");
    }

    return {
      ...parsed,
      fontSize: parsed.fontSize ?? DEFAULT_FONT_SIZE,
    };
  }

  return parsed;
};

export const validateNickname = (nickname: string): string => {
  const trimmed = nickname.trim();

  if (trimmed.length < 2 || trimmed.length > 12) {
    throw new Error("invalid_nickname");
  }

  return trimmed;
};

export const parsePenStroke = (input: unknown): PenStrokeInput => {
  const parsed = penStrokeSchema.parse(input);
  return parsed;
};

export const parseTextStroke = (input: unknown): TextStrokeInput => {
  const parsed = textStrokeSchema.parse(input);
  return parsed;
};
