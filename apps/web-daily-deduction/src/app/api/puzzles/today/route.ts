import { NextResponse } from "next/server";
import { getKstPuzzleDate } from "@1-blue/core/daily-deduction";
import { getTodayPuzzle } from "@/lib/repository";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId");

  if (!sessionId) {
    return NextResponse.json({ error: "session_required" }, { status: 400 });
  }

  try {
    const puzzle = await getTodayPuzzle(sessionId, getKstPuzzleDate());
    return NextResponse.json({ puzzle });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown_error";
    const status = message === "puzzle_not_found" ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
};
