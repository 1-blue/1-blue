import { NextResponse } from "next/server";
import { getStats } from "@/lib/repository";

type RouteContext = { params: Promise<{ admin_token: string }> };

export const GET = async (_request: Request, context: RouteContext) => {
  try {
    const { admin_token } = await context.params;
    const stats = await getStats(admin_token);
    return NextResponse.json(stats);
  } catch {
    return NextResponse.json({ error: "cbt_not_found" }, { status: 404 });
  }
};
