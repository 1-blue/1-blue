import { NextResponse } from "next/server";
import { getAttemptResult } from "@/lib/repository";

type RouteContext = { params: Promise<{ public_id: string; attempt_id: string }> };

export const GET = async (_request: Request, context: RouteContext) => {
  try {
    const { public_id, attempt_id } = await context.params;
    const result = await getAttemptResult(public_id, attempt_id);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === "attempt_not_submitted") {
      return NextResponse.json({ error: "attempt_not_submitted" }, { status: 403 });
    }
    return NextResponse.json({ error: "attempt_not_found" }, { status: 404 });
  }
};
