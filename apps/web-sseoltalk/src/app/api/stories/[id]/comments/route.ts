import { NextResponse } from "next/server";
import { createComment } from "@/lib/repository";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export const POST = async (request: Request, context: RouteContext) => {
  const { id } = await context.params;
  const body = (await request.json()) as {
    sessionId?: string;
    nickname?: string;
    password?: string;
    content?: string;
    parentCommentId?: string | null;
  };

  if (!body.sessionId || !body.nickname || !body.password || !body.content) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  try {
    const comment = await createComment(id, body.sessionId, {
      nickname: body.nickname,
      password: body.password,
      content: body.content,
      parentCommentId: body.parentCommentId,
    });
    return NextResponse.json(comment);
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown_error";
    const status =
      message === "reply_depth_exceeded" || message.startsWith("invalid_") ? 400 : 404;
    return NextResponse.json({ error: message }, { status });
  }
};
