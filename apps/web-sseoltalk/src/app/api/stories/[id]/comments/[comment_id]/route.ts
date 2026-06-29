import { NextResponse } from "next/server";
import { deleteComment, updateComment } from "@/lib/repository";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string; comment_id: string }> };

export const PATCH = async (request: Request, context: RouteContext) => {
  const { id, comment_id } = await context.params;
  const body = (await request.json()) as { password?: string; content?: string };

  if (!body.password || !body.content) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  try {
    const result = await updateComment(id, comment_id, body.password, body.content);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown_error";
    const status = message === "invalid_password" ? 403 : 404;
    return NextResponse.json({ error: message }, { status });
  }
};

export const DELETE = async (request: Request, context: RouteContext) => {
  const { id, comment_id } = await context.params;
  const body = (await request.json()) as { password?: string };

  if (!body.password) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  try {
    await deleteComment(id, comment_id, body.password);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown_error";
    const status = message === "invalid_password" ? 403 : 404;
    return NextResponse.json({ error: message }, { status });
  }
};
