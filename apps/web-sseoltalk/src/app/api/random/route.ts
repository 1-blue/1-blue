import { NextResponse } from "next/server";
import { getRandomStoryId } from "@/lib/repository";

export const GET = async () => {
  const id = await getRandomStoryId();
  if (!id) {
    return NextResponse.json({ error: "empty" }, { status: 404 });
  }
  return NextResponse.json({ id });
};
