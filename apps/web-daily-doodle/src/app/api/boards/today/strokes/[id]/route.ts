import { NextResponse } from "next/server";
import { deleteOwnStroke, moveOwnStroke } from "@/lib/repository";

type DeleteStrokeBody = {
  sessionId: string;
};

type PatchStrokeBody = {
  sessionId: string;
  dx: number;
  dy: number;
};

export const DELETE = async (
  request: Request,
  context: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as DeleteStrokeBody;

    if (!body.sessionId) {
      return NextResponse.json({ error: "invalid_body" }, { status: 400 });
    }

    const result = await deleteOwnStroke({ strokeId: id, sessionId: body.sessionId });
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown_error";
    const status =
      message === "forbidden" ? 403 : message === "stroke_not_found" ? 404 : 400;

    return NextResponse.json({ error: message }, { status });
  }
};

export const PATCH = async (
  request: Request,
  context: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as PatchStrokeBody;

    if (!body.sessionId || typeof body.dx !== "number" || typeof body.dy !== "number") {
      return NextResponse.json({ error: "invalid_body" }, { status: 400 });
    }

    const stroke = await moveOwnStroke({
      strokeId: id,
      sessionId: body.sessionId,
      dx: body.dx,
      dy: body.dy,
    });

    return NextResponse.json(stroke);
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown_error";
    const status =
      message === "forbidden"
        ? 403
        : message === "stroke_not_found"
          ? 404
          : message === "stroke_out_of_bounds"
            ? 400
            : 400;

    return NextResponse.json({ error: message }, { status });
  }
};
