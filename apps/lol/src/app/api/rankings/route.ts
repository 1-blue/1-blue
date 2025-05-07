import { NextResponse } from "next/server";
import { getSupabaseFromAdminRole } from "@1-blue/supabase/server";

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

  const supabase = getSupabaseFromAdminRole();

  const { data, error } = await supabase
    .schema("lol")
    .from("rankings")
    .insert([{ nickname, password, score, completion_time, quiz_type }])
    .select("id");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, id: data?.[0]?.id });
}
