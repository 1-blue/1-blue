import { NextResponse } from "next/server";
import { getPublicCbt } from "@/lib/repository";

type RouteContext = { params: Promise<{ public_id: string }> };

export const GET = async (_request: Request, context: RouteContext) => {
  try {
    const { public_id } = await context.params;
    const cbt = await getPublicCbt(public_id);
    return NextResponse.json({
      publicId: cbt.publicId,
      metadata: cbt.metadata,
      questions: cbt.questions,
    });
  } catch {
    return NextResponse.json({ error: "cbt_not_found" }, { status: 404 });
  }
};
