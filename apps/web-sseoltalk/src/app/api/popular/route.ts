import { NextResponse } from "next/server";
import { listPopularToday } from "@/lib/repository";

export const GET = async () => {
  const items = await listPopularToday();
  return NextResponse.json({ items });
};
