import { NextRequest, NextResponse } from "next/server";
import { generateQuizzes } from "./quiz-api";

/**
 * 퀴즈 데이터를 가져오는 API 엔드포인트
 * GET /api/quiz?count=10&type=multiple-choice
 */
export async function GET(request: NextRequest) {
  try {
    // 쿼리 파라미터에서 count와 type 값 추출
    const searchParams = request.nextUrl.searchParams;
    const countParam = searchParams.get("count");
    const typeParam = searchParams.get("type");

    const count = countParam ? parseInt(countParam, 10) : 10;
    const quizType =
      typeParam === "multiple-choice" || typeParam === "short-answer"
        ? typeParam
        : "multiple-choice";

    // 유효한 count 값 확인
    if (isNaN(count) || count < 1 || count > 20) {
      return NextResponse.json(
        { error: "Count 파라미터는 1부터 20 사이의 정수여야 합니다." },
        { status: 400 }
      );
    }

    // 퀴즈 데이터 생성
    const quizzes = await generateQuizzes(count, quizType);

    if (quizzes.length === 0) {
      return NextResponse.json(
        { error: "퀴즈 데이터를 생성할 수 없습니다." },
        { status: 500 }
      );
    }

    // 응답 반환
    return NextResponse.json(
      {
        quizzes,
        count: quizzes.length,
        type: quizType,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("퀴즈 API 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
