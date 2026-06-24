import { NextResponse } from "next/server";
import { getKstPuzzleDate } from "@1-blue/core/daily-deduction";
import { generatePuzzleForDate } from "@/lib/repository";
import { notifySlack } from "@/lib/slack";

export const POST = async (request: Request) => {
  const secret = request.headers.get("x-admin-secret");
  const adminSecret = process.env.ADMIN_SECRET;

  if (!adminSecret || secret !== adminSecret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { date?: string };
    const date = body.date ?? getKstPuzzleDate();
    await generatePuzzleForDate(date);
    await notifySlack(`오늘의 추론: 수동 생성 완료 (${date})`);
    return NextResponse.json({ ok: true, date });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown_error";
    await notifySlack(`오늘의 추론: 수동 생성 실패 — ${message}`);
    return NextResponse.json({ error: message }, { status: 500 });
  }
};
