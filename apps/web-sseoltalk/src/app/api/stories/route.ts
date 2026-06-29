import { NextResponse } from "next/server";
import { isStoryCategory } from "@1-blue/core/sseoltalk";
import { listPublishedStories } from "@/lib/repository";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const categoryParam = searchParams.get("category");
  const cursor = searchParams.get("cursor") ?? undefined;
  const category =
    categoryParam && categoryParam !== "전체" && isStoryCategory(categoryParam)
      ? categoryParam
      : undefined;

  const result = await listPublishedStories({ category, cursor });
  return NextResponse.json(result);
};
