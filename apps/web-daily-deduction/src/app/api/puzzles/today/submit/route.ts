import { NextResponse } from "next/server";
import { getKstPuzzleDate } from "@/core";
import { submitTodayPuzzle } from "@/lib/repository";

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const result = await submitTodayPuzzle(getKstPuzzleDate(), body);
    return NextResponse.json({ result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown_error";
    const status =
      message === "already_submitted" ? 409 : message === "puzzle_not_found" ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
};
