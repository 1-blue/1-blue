import { NextResponse } from "next/server";
import type { CbtDraft } from "@/core";
import { validateCbtDraftForSave } from "@/core";
import { createCbt } from "@/lib/repository";

export const POST = async (request: Request) => {
  try {
    const body = (await request.json()) as CbtDraft;
    const parsed = validateCbtDraftForSave(body);
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "validation_failed";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const result = await createCbt(parsed.data);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown_error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
};
