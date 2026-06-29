import { NextResponse } from "next/server";
import {
  generateStories,
  hasPublishedStoryOn,
  publishStoryById,
} from "@/lib/repository";
import { getKstToday } from "@/lib/kst";

export const runtime = "nodejs";

export const GET = async (request: Request) => {
  const secret = request.headers.get("authorization")?.replace("Bearer ", "");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || secret !== cronSecret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const today = getKstToday();

  try {
    if (await hasPublishedStoryOn(today)) {
      return NextResponse.json({ status: "skipped", reason: "already_published_today", date: today });
    }

    const { created, discarded } = await generateStories({ count: 1 });

    if (created.length === 0) {
      return NextResponse.json(
        { status: "failed", reason: "generation_failed", discarded },
        { status: 500 },
      );
    }

    const storyId = created[0]!;
    await publishStoryById(storyId, today);

    return NextResponse.json({
      status: "created",
      storyId,
      publishedAt: today,
      discarded,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown_error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
};
