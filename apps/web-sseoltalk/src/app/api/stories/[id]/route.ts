import { NextResponse } from "next/server";
import { getStoryDetail } from "@/lib/repository";

type RouteContext = { params: Promise<{ id: string }> };

export const GET = async (request: Request, context: RouteContext) => {
  const { id } = await context.params;
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId") ?? undefined;

  const story = await getStoryDetail(id, sessionId);
  if (!story) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json(story);
};
