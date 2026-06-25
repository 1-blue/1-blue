import { NextResponse } from "next/server";
import { toggleCommentLike } from "@/lib/repository";

type RouteContext = { params: Promise<{ public_id: string; comment_id: string }> };

export const POST = async (request: Request, context: RouteContext) => {
  try {
    const { public_id, comment_id } = await context.params;
    const body = (await request.json()) as { attemptId?: string };
    if (!body.attemptId) {
      return NextResponse.json({ error: "attempt_required" }, { status: 400 });
    }
    const result = await toggleCommentLike(public_id, comment_id, body.attemptId);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown_error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
};
