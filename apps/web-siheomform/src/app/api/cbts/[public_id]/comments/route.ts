import { NextResponse } from "next/server";
import { createCbtComment, listCbtComments } from "@/lib/repository";

type RouteContext = { params: Promise<{ public_id: string }> };

export const GET = async (request: Request, context: RouteContext) => {
  const { public_id } = await context.params;
  const { searchParams } = new URL(request.url);
  const attemptId = searchParams.get("attemptId") ?? undefined;
  const items = await listCbtComments(public_id, attemptId);
  return NextResponse.json({ items });
};

export const POST = async (request: Request, context: RouteContext) => {
  try {
    const { public_id } = await context.params;
    const body = (await request.json()) as { attemptId?: string; content?: string };
    if (!body.attemptId || !body.content?.trim()) {
      return NextResponse.json({ error: "invalid_request" }, { status: 400 });
    }
    const item = await createCbtComment(public_id, body.attemptId, body.content);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown_error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
};
