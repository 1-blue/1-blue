import { anonSupabase } from "#src/apis/annoSupabase";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit") || "10";
  const quizType = searchParams.get("quiz_type");

  let query = anonSupabase
    .schema("lol")
    .from("rankings")
    .select("id, nickname, score, completion_time, created_at, quiz_type")
    .order("score", { ascending: false })
    .order("completion_time", { ascending: true });

  if (quizType) {
    query = query.eq("quiz_type", quizType);
  }

  const { data, error } = await query.limit(parseInt(limit));

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { nickname, password, score, completion_time, quiz_type } = body;

  if (
    !nickname ||
    !password ||
    score === undefined ||
    completion_time === undefined ||
    !quiz_type
  ) {
    return NextResponse.json(
      { error: "필수 정보가 누락되었습니다." },
      { status: 400 }
    );
  }

  const { data, error } = await anonSupabase
    .schema("lol")
    .from("rankings")
    .insert([{ nickname, password, score, completion_time, quiz_type }])
    .select("id");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, id: data?.[0]?.id });
}
