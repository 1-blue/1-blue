import { NextResponse } from "next/server";
import { isStoryCategory } from "@/core";
import { assertAdminSecret } from "@/lib/admin-auth";
import { generateStories } from "@/lib/repository";

export const runtime = "nodejs";

export const POST = async (request: Request) => {
  try {
    assertAdminSecret(request);
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { count?: number; category?: string };
    const category = body.category && isStoryCategory(body.category) ? body.category : undefined;
    const result = await generateStories({ count: body.count ?? 1, category });
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown_error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
};
