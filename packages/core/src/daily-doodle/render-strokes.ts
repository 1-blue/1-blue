import getStroke from "perfect-freehand";
import { getTextFontSize } from "./stroke-bounds";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  type PenStrokeInput,
  type StrokeInput,
  type StrokeRecord,
  type TextFont,
} from "./stroke-types";

const fontFamilyMap: Record<TextFont, string> = {
  hand: '"Nanum Pen Script", "Comic Sans MS", cursive',
  sans: "var(--font-sans), 'Noto Sans KR', sans-serif",
  serif: "Georgia, 'Noto Serif KR', serif",
};

const getSvgPathFromStroke = (stroke: number[][]): string => {
  if (stroke.length === 0) {
    return "";
  }

  const d = stroke.reduce((acc, point, i, arr) => {
    const x0 = point[0] ?? 0;
    const y0 = point[1] ?? 0;
    const [x1 = x0, y1 = y0] = arr[(i + 1) % arr.length] ?? [x0, y0];

    if (i === 0) {
      return `M ${x0} ${y0} Q ${x0} ${y0} ${(x0 + x1) / 2} ${(y0 + y1) / 2}`;
    }

    return `${acc} T ${(x0 + x1) / 2} ${(y0 + y1) / 2}`;
  }, "");

  return `${d} Z`;
};

const drawPenStroke = (
  ctx: CanvasRenderingContext2D,
  stroke: PenStrokeInput,
  scaleX: number,
  scaleY: number,
) => {
  const outline = getStroke(
    stroke.points.map((point) => {
      const [x, y, pressure] = point;
      return [x * scaleX, y * scaleY, pressure ?? 0.5];
    }),
    {
      size: stroke.width * Math.max(scaleX, scaleY),
      thinning: 0.6,
      smoothing: 0.5,
      streamline: 0.5,
    },
  );

  const pathData = getSvgPathFromStroke(outline);
  const path = new Path2D(pathData);

  ctx.fillStyle = stroke.color;
  ctx.fill(path);
};

const drawTextStroke = (
  ctx: CanvasRenderingContext2D,
  stroke: Extract<StrokeInput, { tool: "text" }>,
  scaleX: number,
  scaleY: number,
) => {
  const baseFontSize = getTextFontSize(stroke);
  const fontSize = baseFontSize * Math.max(scaleX, scaleY);
  const lineHeight = fontSize * 1.25;
  ctx.font = `${fontSize}px ${fontFamilyMap[stroke.fontFamily]}`;
  ctx.fillStyle = stroke.color;
  ctx.textBaseline = "top";

  const lines = stroke.textContent.split("\n");
  const x = stroke.x * scaleX;
  let y = stroke.y * scaleY;

  for (const line of lines) {
    ctx.fillText(line, x, y);
    y += lineHeight;
  }
};

export const renderStrokes = (
  ctx: CanvasRenderingContext2D,
  strokes: StrokeInput[],
  width: number,
  height: number,
) => {
  const scaleX = width / CANVAS_WIDTH;
  const scaleY = height / CANVAS_HEIGHT;

  for (const stroke of strokes) {
    if (stroke.tool === "pen") {
      drawPenStroke(ctx, stroke, scaleX, scaleY);
      continue;
    }

    drawTextStroke(ctx, stroke, scaleX, scaleY);
  }
};

export const renderStrokeRecords = (
  ctx: CanvasRenderingContext2D,
  strokes: StrokeRecord[],
  width: number,
  height: number,
) => {
  renderStrokes(ctx, strokes, width, height);
};

export const drawPaperBackground = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  paperColor = "#FFFDF5",
  lineColor = "#E8DFC8",
) => {
  ctx.fillStyle = paperColor;
  ctx.fillRect(0, 0, width, height);

  const lineSpacing = (24 * height) / CANVAS_HEIGHT;
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.35;

  for (let y = lineSpacing; y < height; y += lineSpacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
};
