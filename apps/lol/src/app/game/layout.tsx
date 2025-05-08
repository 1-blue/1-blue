"use client";

import { PropsWithChildren } from "react";
import { QuizProvider, QuizType } from "./_context/QuizContext";
import { useSearchParams } from "next/navigation";

const MAX_QUIZ_COUNT = 10;

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const searchParams = useSearchParams();
  const quizType = (searchParams.get("type") ?? "multiple-choice") as QuizType;

  return (
    <QuizProvider quizCount={MAX_QUIZ_COUNT} quizType={quizType}>
      {children}
    </QuizProvider>
  );
};

export default Layout;
