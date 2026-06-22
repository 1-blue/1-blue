import { NextResponse } from "next/server";
import { pickSlot } from "@/lib/repository";

type RouteContext = {
  params: Promise<{ shortCode: string }>;
};

export const POST = async (request: Request, context: RouteContext) => {
  const { shortCode } = await context.params;

  try {
    const body = (await request.json()) as { token?: string; slotIndex?: number };

    if (!body.token || body.slotIndex === undefined) {
      return NextResponse.json({ error: "invalid_body" }, { status: 400 });
    }

    const result = await pickSlot(shortCode, body.token, body.slotIndex);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "pick_failed";
    const status = message.includes("slot_taken") ? 409 : 400;
    return NextResponse.json({ error: message }, { status });
  }
};
