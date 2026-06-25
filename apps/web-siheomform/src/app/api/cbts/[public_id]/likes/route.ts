import { NextResponse } from "next/server";
import { getCbtLikeStatus, toggleCbtLike } from "@/lib/repository";

type RouteContext = { params: Promise<{ public_id: string }> };

export const GET = async (request: Request, context: RouteContext) => {
  const { public_id } = await context.params;
  const { searchParams } = new URL(request.url);
  const attemptId = searchParams.get("attemptId") ?? undefined;
  const status = await getCbtLikeStatus(public_id, attemptId);
  return NextResponse.json(status);
};

export const POST = async (request: Request, context: RouteContext) => {
  try {
    const { public_id } = await context.params;
    const body = (await request.json()) as { attemptId?: string };
    if (!body.attemptId) {
      return NextResponse.json({ error: "attempt_required" }, { status: 400 });
    }
    const result = await toggleCbtLike(public_id, body.attemptId);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown_error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
};
