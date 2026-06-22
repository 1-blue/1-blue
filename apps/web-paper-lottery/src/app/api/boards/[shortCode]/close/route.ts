import { NextResponse } from "next/server";
import { closeBoard } from "@/lib/repository";

type RouteContext = {
  params: Promise<{ shortCode: string }>;
};

export const PATCH = async (request: Request, context: RouteContext) => {
  const { shortCode } = await context.params;
  const token = new URL(request.url).searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "missing_token" }, { status: 401 });
  }

  try {
    const board = await closeBoard(shortCode, token);

    if (!board) {
      return NextResponse.json({ error: "unauthorized" }, { status: 403 });
    }

    return NextResponse.json(board);
  } catch (error) {
    const message = error instanceof Error ? error.message : "close_failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
};
