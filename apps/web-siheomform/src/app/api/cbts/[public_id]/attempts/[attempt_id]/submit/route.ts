import { NextResponse } from "next/server";
import { submitAttempt, type SubmitAnswerInput } from "@/lib/repository";

type RouteContext = { params: Promise<{ public_id: string; attempt_id: string }> };

export const POST = async (request: Request, context: RouteContext) => {
  try {
    const { public_id, attempt_id } = await context.params;
    const body = (await request.json()) as { answers?: SubmitAnswerInput[] };
    if (!body.answers?.length) {
      return NextResponse.json({ error: "answers_required" }, { status: 400 });
    }

    const result = await submitAttempt(public_id, attempt_id, body.answers);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown_error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
};
