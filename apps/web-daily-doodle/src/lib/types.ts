import type { Point, StrokeInput, StrokeRecord, TextFont } from "@/core";

export type BoardView = {
  id: string;
  boardDate: string;
  status: "open" | "closed";
  strokeCount: number;
  strokes: StrokeRecord[];
};

export type ArchiveListItem = {
  boardDate: string;
  strokeCount: number;
  participantCount: number;
  closedAt: string;
};

export type ArchiveDetailView = {
  boardDate: string;
  strokes: StrokeRecord[];
  participantCount: number;
  closedAt: string;
};

export type CreateStrokePayload = StrokeInput & {
  sessionId: string;
  nickname: string;
};

export type BroadcastStrokeEvent =
  | { type: "new_stroke"; stroke: StrokeRecord }
  | { type: "remove_stroke"; id: string }
  | { type: "move_stroke"; stroke: StrokeRecord }
  | { type: "day_closed"; boardDate: string };

export type DbStrokeRow = {
  id: string;
  board_id: string;
  session_id: string;
  nickname: string;
  tool: "pen" | "text";
  color: string;
  width: number | null;
  points: unknown;
  text_content: string | null;
  font_family: string | null;
  x: number | null;
  y: number | null;
  created_at: string;
};

export const mapDbStrokeToRecord = (row: DbStrokeRow): StrokeRecord => {
  if (row.tool === "pen") {
    return {
      id: row.id,
      sessionId: row.session_id,
      nickname: row.nickname,
      createdAt: row.created_at,
      tool: "pen",
      color: row.color,
      width: row.width ?? 4,
      points: Array.isArray(row.points) ? (row.points as Point[]) : [],
    };
  }

  return {
    id: row.id,
    sessionId: row.session_id,
    nickname: row.nickname,
    createdAt: row.created_at,
    tool: "text",
    color: row.color,
    textContent: row.text_content ?? "",
    fontFamily: (row.font_family ?? "hand") as TextFont,
    fontSize: row.width ?? 28,
    x: row.x ?? 0,
    y: row.y ?? 0,
  };
};
