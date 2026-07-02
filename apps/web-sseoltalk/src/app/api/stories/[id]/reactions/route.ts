import { NextResponse } from "next/server";
import { isReactionType } from "@/core";
import { toggleReaction } from "@/lib/repository";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export const POST = async (request: Request, context: RouteContext) => {
  const { id } = await context.params;
  const body = (await request.json()) as { sessionId?: string; type?: string };

  if (!body.sessionId || !body.type || !isReactionType(body.type)) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  try {
    const result = await toggleReaction(id, body.sessionId, body.type);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
};
