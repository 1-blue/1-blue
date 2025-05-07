import { motion } from "framer-motion";
import { useQuizContext } from "#src/app/game/_context/QuizContext";
import { useEffect, useState } from "react";
import { cn } from "@1-blue/ui/lib";
import { Tabs, TabsList, TabsTrigger } from "@1-blue/ui/components/tabs";

type ImageType = "splash" | "loading";

const QuizImage = () => {
  const { currentQuiz, quizzes } = useQuizContext();
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageType, setImageType] = useState<ImageType>(() => {
    // localStorage에서 이미지 타입 불러오기
    const savedType = localStorage.getItem("quiz-image-type");
    return savedType === "splash" || savedType === "loading"
      ? savedType
      : "splash";
  });

  // 이미지 타입 변경 시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem("quiz-image-type", imageType);
  }, [imageType]);

  // 다음 이미지 미리 로드
  useEffect(() => {
    if (!quizzes || !currentQuiz) return;

    const currentIndex = quizzes.findIndex(
      (quiz) => quiz.id === currentQuiz.id
    );
    if (currentIndex === -1 || currentIndex >= quizzes.length - 1) return;

    // 다음 퀴즈 이미지 미리 로드
    const nextImageUrl = quizzes[currentIndex + 1].splashImageUrl;
    if (nextImageUrl) {
      const img = new Image();
      img.src = nextImageUrl;
    }

    const nextLoadingImageUrl = quizzes[currentIndex + 1].loadingImageUrl;
    if (nextLoadingImageUrl) {
      const img = new Image();
      img.src = nextLoadingImageUrl;
    }
  }, [currentQuiz, quizzes]);

  // 이미지 변경 시 로드 상태 초기화
  useEffect(() => {
    setIsLoaded(false);
  }, [currentQuiz, imageType]);

  if (!currentQuiz) return null;

  const imageUrl =
    imageType === "splash"
      ? currentQuiz.splashImageUrl
      : currentQuiz.loadingImageUrl;

  return (
    <div className="w-full max-w-md mb-8">
      {/* 이미지 선택 탭 */}
      <Tabs
        defaultValue={imageType}
        onValueChange={(value) => setImageType(value as ImageType)}
        className="mb-2"
      >
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="splash">스플래쉬</TabsTrigger>
          <TabsTrigger value="loading">로딩</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* 이미지 표시 영역 */}
      <motion.div
        className="w-full rounded-sm overflow-hidden shadow-lg shadow-muted/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
        transition={{ duration: 0.5 }}
      >
        <div
          className={cn(
            "relative w-full max-h-[240px]",
            imageType === "splash" ? "aspect-video" : "aspect-[308/560]"
          )}
        >
          <img
            src={imageUrl}
            alt="챔피언 스킨 이미지"
            onLoad={() => setIsLoaded(true)}
            className={cn(
              "w-full h-full",
              imageType === "splash" ? "object-cover" : "object-contain",
              isLoaded ? "block" : "hidden"
            )}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default QuizImage;
