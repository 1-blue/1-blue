import { NextResponse } from "next/server";
import { runEnsureLookahead } from "@/lib/repository";
import { notifySlack } from "@/lib/slack";

export const GET = async (request: Request) => {
  const secret = request.headers.get("authorization")?.replace("Bearer ", "");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || secret !== cronSecret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const result = await runEnsureLookahead();
    const summary = `오늘의 추론: 퍼즐 생성 완료 (생성: ${result.generated.join(", ") || "없음"})`;
    await notifySlack(summary);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown_error";
    await notifySlack(`오늘의 추론: Cron 생성 실패 — ${message}`);
    return NextResponse.json({ error: message }, { status: 500 });
  }
};
