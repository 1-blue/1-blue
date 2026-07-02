import {
  checkRateLimits,
  getKstBoardDate,
  getYesterdayBoardDate,
  isValidBoardDate,
  translateStroke,
  validateNickname,
  validateStrokeInput,
  type StrokeInput,
} from "@/core";
import { getDb } from "./db";
import { broadcastBoardEvent } from "./realtime";
import {
  mapDbStrokeToRecord,
  type ArchiveDetailView,
  type ArchiveListItem,
  type BoardView,
} from "./types";

type DbBoard = {
  id: string;
  board_date: string;
  status: "open" | "closed";
  stroke_count: number;
};

const ensureOpenBoard = async (boardDate: string): Promise<DbBoard> => {
  const db = getDb();

  const { data: existing, error: fetchError } = await db
    .from("boards")
    .select("id, board_date, status, stroke_count")
    .eq("board_date", boardDate)
    .maybeSingle();

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  if (existing) {
    if (existing.status === "closed") {
      throw new Error("board_closed");
    }

    return existing;
  }

  const { data: created, error: insertError } = await db
    .from("boards")
    .insert({ board_date: boardDate, status: "open" })
    .select("id, board_date, status, stroke_count")
    .single();

  if (insertError || !created) {
    throw new Error(insertError?.message ?? "board_create_failed");
  }

  return created;
};

const getSessionStrokesLastMinute = async (boardId: string, sessionId: string): Promise<number> => {
  const db = getDb();
  const since = new Date(Date.now() - 60_000).toISOString();

  const { count, error } = await db
    .from("strokes")
    .select("id", { count: "exact", head: true })
    .eq("board_id", boardId)
    .eq("session_id", sessionId)
    .gte("created_at", since);

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
};

const fetchBoardStrokes = async (boardId: string) => {
  const db = getDb();

  const { data, error } = await db
    .from("strokes")
    .select("*")
    .eq("board_id", boardId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(mapDbStrokeToRecord);
};

export const getTodayBoard = async (): Promise<BoardView> => {
  const boardDate = getKstBoardDate();
  const board = await ensureOpenBoard(boardDate);
  const strokes = await fetchBoardStrokes(board.id);

  return {
    id: board.id,
    boardDate: board.board_date,
    status: board.status,
    strokeCount: board.stroke_count,
    strokes,
  };
};

export const createStroke = async (params: {
  sessionId: string;
  nickname: string;
  stroke: StrokeInput;
}) => {
  const boardDate = getKstBoardDate();
  const board = await ensureOpenBoard(boardDate);
  const validatedNickname = validateNickname(params.nickname);
  const validatedStroke = validateStrokeInput(params.stroke);

  const sessionStrokesLastMinute = await getSessionStrokesLastMinute(board.id, params.sessionId);

  checkRateLimits({
    boardStrokeCount: board.stroke_count,
    sessionStrokesLastMinute,
  });

  const db = getDb();

  const { data: inserted, error: insertError } =
    validatedStroke.tool === "pen"
      ? await db
          .from("strokes")
          .insert({
            board_id: board.id,
            session_id: params.sessionId,
            nickname: validatedNickname,
            tool: "pen",
            color: validatedStroke.color,
            width: validatedStroke.width,
            points: validatedStroke.points as unknown as import("@1-blue/database/types").Json,
          })
          .select("*")
          .single()
      : await db
          .from("strokes")
          .insert({
            board_id: board.id,
            session_id: params.sessionId,
            nickname: validatedNickname,
            tool: "text",
            color: validatedStroke.color,
            text_content: validatedStroke.textContent,
            font_family: validatedStroke.fontFamily,
            width: validatedStroke.fontSize,
            x: validatedStroke.x,
            y: validatedStroke.y,
          })
          .select("*")
          .single();

  if (insertError || !inserted) {
    throw new Error(insertError?.message ?? "stroke_insert_failed");
  }

  const { error: updateError } = await db
    .from("boards")
    .update({ stroke_count: board.stroke_count + 1 })
    .eq("id", board.id);

  if (updateError) {
    throw new Error(updateError.message);
  }

  const strokeRecord = mapDbStrokeToRecord(inserted);

  try {
    await broadcastBoardEvent(boardDate, { type: "new_stroke", stroke: strokeRecord });
  } catch {
    // Broadcast failure should not block stroke creation.
  }

  return strokeRecord;
};

export const deleteOwnStroke = async (params: { strokeId: string; sessionId: string }) => {
  const boardDate = getKstBoardDate();
  const db = getDb();

  const { data: stroke, error: fetchError } = await db
    .from("strokes")
    .select("id, session_id, board_id")
    .eq("id", params.strokeId)
    .maybeSingle();

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  if (!stroke) {
    throw new Error("stroke_not_found");
  }

  if (stroke.session_id !== params.sessionId) {
    throw new Error("forbidden");
  }

  const { error: deleteError } = await db.from("strokes").delete().eq("id", params.strokeId);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  const { data: board } = await db
    .from("boards")
    .select("stroke_count")
    .eq("id", stroke.board_id)
    .single();

  if (board) {
    await db
      .from("boards")
      .update({ stroke_count: Math.max(0, board.stroke_count - 1) })
      .eq("id", stroke.board_id);
  }

  try {
    await broadcastBoardEvent(boardDate, { type: "remove_stroke", id: params.strokeId });
  } catch {
    // ignore broadcast errors
  }

  return { id: params.strokeId };
};

export const moveOwnStroke = async (params: {
  strokeId: string;
  sessionId: string;
  dx: number;
  dy: number;
}) => {
  const boardDate = getKstBoardDate();
  const db = getDb();

  const { data: row, error: fetchError } = await db
    .from("strokes")
    .select("*")
    .eq("id", params.strokeId)
    .maybeSingle();

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  if (!row) {
    throw new Error("stroke_not_found");
  }

  if (row.session_id !== params.sessionId) {
    throw new Error("forbidden");
  }

  const current = mapDbStrokeToRecord(row);

  let moved: ReturnType<typeof mapDbStrokeToRecord>;

  try {
    moved = translateStroke(current, params.dx, params.dy);
  } catch (error) {
    const message = error instanceof Error ? error.message : "stroke_out_of_bounds";
    throw new Error(message);
  }

  const updatePayload =
    moved.tool === "pen"
      ? { points: moved.points as unknown as import("@1-blue/database/types").Json }
      : { x: moved.x, y: moved.y };

  const { data: updated, error: updateError } = await db
    .from("strokes")
    .update(updatePayload)
    .eq("id", params.strokeId)
    .select("*")
    .single();

  if (updateError || !updated) {
    throw new Error(updateError?.message ?? "stroke_update_failed");
  }

  const strokeRecord = mapDbStrokeToRecord(updated);

  try {
    await broadcastBoardEvent(boardDate, { type: "move_stroke", stroke: strokeRecord });
  } catch {
    // ignore broadcast errors
  }

  return strokeRecord;
};

export const listArchives = async (): Promise<ArchiveListItem[]> => {
  const db = getDb();

  const { data, error } = await db
    .from("snapshots")
    .select("board_date, strokes, participant_count, closed_at")
    .order("board_date", { ascending: false })
    .limit(30);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => ({
    boardDate: row.board_date,
    strokeCount: Array.isArray(row.strokes) ? row.strokes.length : 0,
    participantCount: row.participant_count,
    closedAt: row.closed_at,
  }));
};

export const getArchiveDetail = async (boardDate: string): Promise<ArchiveDetailView> => {
  if (!isValidBoardDate(boardDate)) {
    throw new Error("invalid_date");
  }

  const db = getDb();

  const { data, error } = await db
    .from("snapshots")
    .select("board_date, strokes, participant_count, closed_at")
    .eq("board_date", boardDate)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("archive_not_found");
  }

  const strokes = Array.isArray(data.strokes)
    ? data.strokes.map((item, index) => {
        const record = item as Record<string, unknown>;
        return mapDbStrokeToRecord({
          id: String(record.id ?? `archive-${index}`),
          board_id: "archive",
          session_id: String(record.sessionId ?? record.session_id ?? ""),
          nickname: String(record.nickname ?? ""),
          tool: record.tool === "text" ? "text" : "pen",
          color: String(record.color ?? "#3D2914"),
          width: typeof record.width === "number" ? record.width : null,
          points: record.points ?? null,
          text_content:
            typeof record.textContent === "string"
              ? record.textContent
              : typeof record.text_content === "string"
                ? record.text_content
                : null,
          font_family:
            typeof record.fontFamily === "string"
              ? record.fontFamily
              : typeof record.font_family === "string"
                ? record.font_family
                : null,
          x: typeof record.x === "number" ? record.x : null,
          y: typeof record.y === "number" ? record.y : null,
          created_at: String(record.createdAt ?? record.created_at ?? new Date().toISOString()),
        });
      })
    : [];

  return {
    boardDate: data.board_date,
    strokes,
    participantCount: data.participant_count,
    closedAt: data.closed_at,
  };
};

export const closeYesterdayBoard = async () => {
  const yesterday = getYesterdayBoardDate();
  const db = getDb();

  const { data: board, error: boardError } = await db
    .from("boards")
    .select("id, board_date, status, stroke_count")
    .eq("board_date", yesterday)
    .maybeSingle();

  if (boardError) {
    throw new Error(boardError.message);
  }

  if (!board || board.status === "closed") {
    return { closed: false, boardDate: yesterday };
  }

  const strokes = await fetchBoardStrokes(board.id);
  const participantCount = new Set(strokes.map((stroke) => stroke.sessionId)).size;
  const strokeJson = strokes;

  const { error: snapshotError } = await db.from("snapshots").upsert(
    {
      board_date: yesterday,
      strokes: strokeJson,
      participant_count: participantCount,
      closed_at: new Date().toISOString(),
    },
    { onConflict: "board_date" },
  );

  if (snapshotError) {
    throw new Error(snapshotError.message);
  }

  const { error: closeError } = await db
    .from("boards")
    .update({ status: "closed", closed_at: new Date().toISOString() })
    .eq("id", board.id);

  if (closeError) {
    throw new Error(closeError.message);
  }

  const today = getKstBoardDate();

  try {
    await broadcastBoardEvent(today, { type: "day_closed", boardDate: yesterday });
  } catch {
    // ignore
  }

  return { closed: true, boardDate: yesterday, strokeCount: strokes.length };
};
