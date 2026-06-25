import { NextResponse } from "next/server";
import type { CbtDraft } from "@1-blue/core/siheomform";
import { validateCbtDraftForSave } from "@1-blue/core/siheomform";
import { deleteCbt, getManageCbt, updateCbt } from "@/lib/repository";

type RouteContext = { params: Promise<{ admin_token: string }> };

export const GET = async (_request: Request, context: RouteContext) => {
  try {
    const { admin_token } = await context.params;
    const cbt = await getManageCbt(admin_token);
    return NextResponse.json(cbt);
  } catch {
    return NextResponse.json({ error: "cbt_not_found" }, { status: 404 });
  }
};

export const PATCH = async (request: Request, context: RouteContext) => {
  try {
    const { admin_token } = await context.params;
    const body = (await request.json()) as CbtDraft;
    const parsed = validateCbtDraftForSave(body);
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "validation_failed";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const result = await updateCbt(admin_token, parsed.data);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown_error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
};

export const DELETE = async (_request: Request, context: RouteContext) => {
  try {
    const { admin_token } = await context.params;
    await deleteCbt(admin_token);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown_error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
};
