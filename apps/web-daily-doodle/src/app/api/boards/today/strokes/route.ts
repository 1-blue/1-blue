import { NextResponse } from "next/server";
import type { StrokeInput } from "@/core";
import { createStroke } from "@/lib/repository";

type CreateStrokeBody = {
  sessionId: string;
  nickname: string;
  stroke: StrokeInput;
};

export const POST = async (request: Request) => {
  try {
    const body = (await request.json()) as CreateStrokeBody;

    if (!body.sessionId || !body.nickname || !body.stroke) {
      return NextResponse.json({ error: "invalid_body" }, { status: 400 });
    }

    const stroke = await createStroke({
      sessionId: body.sessionId,
      nickname: body.nickname,
      stroke: body.stroke,
    });

    return NextResponse.json(stroke, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown_error";
    const status =
      message === "rate_limit_exceeded" || message === "daily_cap_exceeded"
        ? 429
        : message === "board_closed"
          ? 409
          : 400;

    return NextResponse.json({ error: message }, { status });
  }
};
