import { NextResponse } from "next/server";
import { getBoardForPlay } from "@/lib/repository";

type RouteContext = {
  params: Promise<{ shortCode: string }>;
};

export const GET = async (request: Request, context: RouteContext) => {
  const { shortCode } = await context.params;
  const token = new URL(request.url).searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "missing_token" }, { status: 401 });
  }

  const board = await getBoardForPlay(shortCode, token);

  if (!board) {
    return NextResponse.json({ error: "unauthorized" }, { status: 403 });
  }

  return NextResponse.json(board);
};
