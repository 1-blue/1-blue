import { NextResponse } from "next/server";
import { toggleCommentLike } from "@/lib/repository";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string; comment_id: string }> };

export const POST = async (request: Request, context: RouteContext) => {
  const { id, comment_id } = await context.params;
  const body = (await request.json()) as { sessionId?: string };

  if (!body.sessionId) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  try {
    const result = await toggleCommentLike(id, comment_id, body.sessionId);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
};
