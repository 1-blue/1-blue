import { NextResponse } from "next/server";
import { getTodayBoard } from "@/lib/repository";

export const GET = async () => {
  try {
    const board = await getTodayBoard();
    return NextResponse.json(board);
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown_error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
};
