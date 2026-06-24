import { NextResponse } from "next/server";
import { getRankingDates } from "@/lib/repository";

export const GET = async () => {
  try {
    const dates = await getRankingDates();
    return NextResponse.json({ dates });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown_error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
};
