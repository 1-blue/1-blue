import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@1-blue/ui/components/carousel";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@1-blue/ui/components/card";
import { cn } from "@1-blue/ui/lib";
import { AnsweredQuiz } from "../../_context/QuizContext";

interface IProps {
  answeredQuizzes: AnsweredQuiz[];
}

const ResultCarousel: React.FC<IProps> = ({ answeredQuizzes }) => {
  if (!answeredQuizzes || answeredQuizzes.length === 0) {
    return null; // 데이터가 없으면 아무것도 렌더링하지 않음
  }
  return (
    // Carousel 전체를 감싸는 div. mx-auto로 중앙 정렬. 버튼을 위한 상대적 위치 기준.
    <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto">
      <Carousel
        opts={{
          align: "start", // 아이템 시작점 정렬
          loop: answeredQuizzes.length > 1, // 아이템이 1개 초과일 때만 루프
        }}
        className="w-full"
      >
        {/* CarouselContent의 왼쪽 마이너스 마진을 -ml-5로 변경 */}
        <CarouselContent className="-ml-10">
          {/* 아이템 간 간격을 위해 음수 마진 조정 */}
          {answeredQuizzes.map((aq, index) => (
            <CarouselItem
              key={aq.quizId}
              className="pl-10 basis-full flex justify-center"
            >
              {/* 카드 컨테이너: 실제 카드 크기(최대 너비)를 여기서 제어 */}
              <div className="w-full max-w-[360px] sm:max-w-[380px]">
                <Card
                  className={cn(
                    "overflow-hidden w-full py-2 gap-1",
                    aq.isCorrect
                      ? "border-green-500 bg-green-500/10"
                      : "border-red-500 bg-red-500/10"
                  )}
                >
                  <CardHeader className="p-3">
                    <CardTitle className="text-sm text-center whitespace-nowrap">
                      문제 {index + 1}
                      {aq.isCorrect ? (
                        <span className="text-green-600 ml-2">정답 ✅</span>
                      ) : (
                        <span className="text-red-600 ml-2">오답 ❌</span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 aspect-[16/9] relative bg-muted/20">
                    <img
                      src={aq.splashImageUrl}
                      alt={`문제 ${index + 1} - ${aq.questionText}`}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </CardContent>
                  <CardFooter className="flex flex-col items-start p-3 text-xs space-y-1">
                    <p className="truncate w-full">
                      <span className="font-semibold">제시어/정답:</span>{" "}
                      {aq.correctAnswer}
                    </p>
                    <p className="truncate w-full">
                      <span className="font-semibold">내 답변:</span>{" "}
                      {aq.userAnswer}
                    </p>
                    {aq.quizType === "multiple-choice" && aq.options && (
                      <div className="w-full pt-2 mt-2 border-t">
                        <p className="font-semibold mb-1">선택지:</p>
                        <ul className="list-disc list-inside pl-1 space-y-0.5">
                          {aq.options.map((opt) => (
                            <li
                              key={opt}
                              className={cn(
                                "truncate",
                                opt === aq.correctAnswer &&
                                  "text-green-700 font-bold",
                                opt === aq.userAnswer &&
                                  opt !== aq.correctAnswer &&
                                  "text-red-700 line-through"
                              )}
                            >
                              {opt}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardFooter>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default ResultCarousel;
