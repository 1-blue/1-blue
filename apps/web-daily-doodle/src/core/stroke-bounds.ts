import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  DEFAULT_FONT_SIZE,
  type Point,
  type StrokeInput,
  type StrokeRecord,
  type TextFont,
} from "./stroke-types";

export type StrokeBounds = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

const fontFamilyMap: Record<TextFont, string> = {
  hand: '"Nanum Pen Script", "Comic Sans MS", cursive',
  sans: "var(--font-sans), 'Noto Sans KR', sans-serif",
  serif: "Georgia, 'Noto Serif KR', serif",
};

const estimateTextLineWidth = (line: string, fontSize: number): number =>
  line.length * fontSize * 0.55;

export const getTextFontSize = (stroke: Extract<StrokeInput, { tool: "text" }>): number =>
  stroke.fontSize ?? DEFAULT_FONT_SIZE;

export const getStrokeBounds = (
  stroke: StrokeInput,
  ctx?: CanvasRenderingContext2D,
): StrokeBounds => {
  if (stroke.tool === "pen") {
    const pad = stroke.width / 2;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const point of stroke.points) {
      const [x, y] = point;
      minX = Math.min(minX, x - pad);
      minY = Math.min(minY, y - pad);
      maxX = Math.max(maxX, x + pad);
      maxY = Math.max(maxY, y + pad);
    }

    return { minX, minY, maxX, maxY };
  }

  const fontSize = getTextFontSize(stroke);
  const lineHeight = fontSize * 1.25;
  const lines = stroke.textContent.split("\n");
  let maxWidth = 0;

  if (ctx) {
    ctx.font = `${fontSize}px ${fontFamilyMap[stroke.fontFamily]}`;
  }

  for (const line of lines) {
    if (ctx) {
      maxWidth = Math.max(maxWidth, ctx.measureText(line).width);
    } else {
      maxWidth = Math.max(maxWidth, estimateTextLineWidth(line, fontSize));
    }
  }

  return {
    minX: stroke.x,
    minY: stroke.y,
    maxX: stroke.x + maxWidth,
    maxY: stroke.y + lines.length * lineHeight,
  };
};

export const isPointInBounds = (x: number, y: number, bounds: StrokeBounds): boolean =>
  x >= bounds.minX && x <= bounds.maxX && y >= bounds.minY && y <= bounds.maxY;

export const hitTestStroke = (
  strokes: StrokeRecord[],
  x: number,
  y: number,
  sessionId: string,
  ctx?: CanvasRenderingContext2D,
): StrokeRecord | null => {
  for (let index = strokes.length - 1; index >= 0; index -= 1) {
    const stroke = strokes[index];

    if (!stroke || stroke.sessionId !== sessionId) {
      continue;
    }

    const bounds = getStrokeBounds(stroke, ctx);

    if (isPointInBounds(x, y, bounds)) {
      return stroke;
    }
  }

  return null;
};

const translatePoint = (point: Point, dx: number, dy: number): Point => {
  const [x, y, pressure] = point;
  return pressure === undefined ? [x + dx, y + dy] : [x + dx, y + dy, pressure];
};

const isBoundsInsideCanvas = (bounds: StrokeBounds): boolean =>
  bounds.minX >= 0 &&
  bounds.minY >= 0 &&
  bounds.maxX <= CANVAS_WIDTH &&
  bounds.maxY <= CANVAS_HEIGHT;

export const translateStroke = <T extends StrokeInput>(
  stroke: T,
  dx: number,
  dy: number,
  ctx?: CanvasRenderingContext2D,
): T => {
  const translated =
    stroke.tool === "pen"
      ? {
          ...stroke,
          points: stroke.points.map((point) => translatePoint(point, dx, dy)),
        }
      : {
          ...stroke,
          x: stroke.x + dx,
          y: stroke.y + dy,
        };

  if (!isBoundsInsideCanvas(getStrokeBounds(translated, ctx))) {
    throw new Error("stroke_out_of_bounds");
  }

  return translated as T;
};
