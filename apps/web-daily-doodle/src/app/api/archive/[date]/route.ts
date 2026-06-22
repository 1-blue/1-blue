import { NextResponse } from "next/server";
import { getArchiveDetail } from "@/lib/repository";

export const GET = async (_request: Request, context: { params: Promise<{ date: string }> }) => {
  try {
    const { date } = await context.params;
    const archive = await getArchiveDetail(date);
    return NextResponse.json(archive);
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown_error";
    const status = message === "archive_not_found" ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
};
