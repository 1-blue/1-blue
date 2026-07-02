import { NextResponse } from "next/server";
import { isValidPuzzleDate } from "@/core";
import { submitArchivePuzzle } from "@/lib/repository";

type RouteContext = { params: Promise<{ date: string }> };

export const POST = async (request: Request, context: RouteContext) => {
  const { date } = await context.params;

  if (!isValidPuzzleDate(date)) {
    return NextResponse.json({ error: "invalid_date" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const result = await submitArchivePuzzle(date, body);
    return NextResponse.json({ result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown_error";
    const status =
      message === "archive_not_available" ? 403 : message === "puzzle_not_found" ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
};
