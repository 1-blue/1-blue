import { NextResponse } from "next/server";
import { listPublicCbts } from "@/lib/repository";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const sortParam = searchParams.get("sort");
  const sort = sortParam === "popular" ? "popular" : sortParam === "likes" ? "likes" : "recent";
  const items = await listPublicCbts(sort);
  return NextResponse.json({ items });
};
