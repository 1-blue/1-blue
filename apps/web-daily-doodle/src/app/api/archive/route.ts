import { NextResponse } from "next/server";
import { listArchives } from "@/lib/repository";

export const GET = async () => {
  try {
    const archives = await listArchives();
    return NextResponse.json({ archives });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown_error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
};
