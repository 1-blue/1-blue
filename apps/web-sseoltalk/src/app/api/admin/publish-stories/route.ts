import { NextResponse } from "next/server";
import { assertAdminSecret } from "@/lib/admin-auth";
import { publishPendingStories } from "@/lib/repository";

export const runtime = "nodejs";

export const POST = async (request: Request) => {
  try {
    assertAdminSecret(request);
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const result = await publishPendingStories();
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown_error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
};
