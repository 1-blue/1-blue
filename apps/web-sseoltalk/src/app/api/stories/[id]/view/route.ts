import { NextResponse } from "next/server";
import { incrementStoryView } from "@/lib/repository";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export const POST = async (request: Request, context: RouteContext) => {
  const { id } = await context.params;
  const body = (await request.json()) as { sessionId?: string };
  if (!body.sessionId) {
    return NextResponse.json({ error: "session_required" }, { status: 400 });
  }

  try {
    const result = await incrementStoryView(id, body.sessionId);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
};
