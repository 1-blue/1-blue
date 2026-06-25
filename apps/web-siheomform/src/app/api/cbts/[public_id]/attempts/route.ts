import { NextResponse } from "next/server";
import { createAttempt } from "@/lib/repository";

type RouteContext = { params: Promise<{ public_id: string }> };

export const POST = async (request: Request, context: RouteContext) => {
  try {
    const { public_id } = await context.params;
    const body = (await request.json()) as { nickname?: string };
    const nickname = body.nickname?.trim();
    if (!nickname) {
      return NextResponse.json({ error: "nickname_required" }, { status: 400 });
    }

    const result = await createAttempt(public_id, nickname);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown_error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
};
