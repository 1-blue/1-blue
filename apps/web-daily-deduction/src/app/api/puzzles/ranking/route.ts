import { NextResponse } from "next/server";
import { getKstPuzzleDate } from "@1-blue/core/daily-deduction";
import { getRanking } from "@/lib/repository";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date") ?? getKstPuzzleDate();
  const sessionId = searchParams.get("sessionId") ?? undefined;

  try {
    const ranking = await getRanking(date, sessionId);
    return NextResponse.json({ ranking });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown_error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
};
