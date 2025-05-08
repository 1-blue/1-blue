"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  ReactNode,
} from "react";
import { type IQuiz, useQuiz } from "#src/app/game/_hooks/useQuiz";

// 퀴즈 타입 정의
export type QuizType = "multiple-choice" | "short-answer";

// 개별 정답/오답 기록 타입
export interface AnsweredQuiz {
  quizId: string;
  questionText: string; // 문제 텍스트 (보통 정답과 동일한 내용)
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  splashImageUrl: string;
  options?: string[]; // 객관식인 경우 선택지
  quizType: QuizType;
}

// Context 타입 정의
interface QuizContextType {
  // 상태
  quizzes: IQuiz[];
  currentQuiz: IQuiz | undefined;
  currentQuizIndex: number;
  selectedOption: string | null;
  inputAnswer: string;
  isCorrect: boolean | null;
  score: number;
  timeLeft: number;
  isGameOver: boolean;
  isLoading: boolean;
  error: Error | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  totalQuizzes: number;
  quizType: QuizType;
  completionTime: number;
  answeredQuizzes: AnsweredQuiz[]; // 정답/오답 기록 추가

  // 메서드
  handleOptionSelect: (option: string) => void;
  handleSubmitAnswer: () => void;
  handleNextQuiz: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Context 생성
const QuizContext = createContext<QuizContextType | null>(null);

// QuizProvider 컴포넌트 props 타입
interface QuizProviderProps {
  children: ReactNode;
  quizCount: number;
  quizType: QuizType;
}

// QuizProvider 컴포넌트
export const QuizProvider = ({
  children,
  quizCount,
  quizType,
}: QuizProviderProps) => {
  const { data: quizzes = [], isLoading, error } = useQuiz(quizCount, quizType);

  // 퀴즈 상태 관리
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [inputAnswer, setInputAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isGameOver, setIsGameOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [answeredQuizzes, setAnsweredQuizzes] = useState<AnsweredQuiz[]>([]); // 정답/오답 기록 상태 초기화

  // 퀴즈 시작 및 완료 시간 추적
  const [startTime, setStartTime] = useState<number | null>(null);
  const [completionTime, setCompletionTime] = useState(0);

  // 현재 퀴즈
  const currentQuiz = quizzes[currentQuizIndex];

  // 주관식 퀴즈에서 인풋 포커스
  useEffect(() => {
    if (
      !isLoading &&
      !isGameOver &&
      quizType === "short-answer" &&
      inputRef.current
    ) {
      inputRef.current.focus();
    }
  }, [isLoading, quizType, currentQuizIndex, isGameOver]);

  // 타이머 설정
  useEffect(() => {
    if (
      isLoading ||
      isGameOver ||
      selectedOption !== null ||
      isCorrect !== null
    )
      return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          const answerTimedOutCorrect = false;
          setIsCorrect(answerTimedOutCorrect);
          if (currentQuiz) {
            setAnsweredQuizzes((prevAnswered) => [
              ...prevAnswered,
              {
                quizId: currentQuiz.id,
                questionText: currentQuiz.correctAnswer, // IQuiz의 correctAnswer를 문제 텍스트로 우선 사용
                userAnswer:
                  quizType === "multiple-choice"
                    ? "시간 초과"
                    : inputAnswer || "시간 초과", // 주관식도 시간 초과 시 빈 문자열 대신 명시
                correctAnswer: currentQuiz.correctAnswer,
                isCorrect: answerTimedOutCorrect,
                splashImageUrl: currentQuiz.splashImageUrl,
                options: currentQuiz.options,
                quizType,
              },
            ]);
          }
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [
    isLoading,
    selectedOption,
    currentQuizIndex,
    isGameOver,
    isCorrect,
    quizType,
    currentQuiz,
    inputAnswer,
  ]);

  // 게임 시작 시 시간 기록
  useEffect(() => {
    if (quizzes.length > 0 && startTime === null && !isLoading && !isGameOver) {
      setStartTime(Date.now());
    }
  }, [quizzes, startTime, isLoading, isGameOver]);

  // 게임 종료 시 시간 계산
  useEffect(() => {
    if (isGameOver && startTime) {
      setCompletionTime(Date.now() - startTime);
    }
  }, [isGameOver, startTime]);

  // 객관식 선택지 선택 처리
  const handleOptionSelect = (option: string) => {
    if (
      selectedOption !== null ||
      isGameOver ||
      isCorrect !== null ||
      !currentQuiz
    )
      return;

    setSelectedOption(option);
    const correct = option === currentQuiz.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setScore((prev) => prev + 100);
    }
    setAnsweredQuizzes((prevAnswered) => [
      ...prevAnswered,
      {
        quizId: currentQuiz.id,
        questionText: currentQuiz.correctAnswer, // IQuiz의 correctAnswer를 문제 텍스트로 우선 사용
        userAnswer: option,
        correctAnswer: currentQuiz.correctAnswer,
        isCorrect: correct,
        splashImageUrl: currentQuiz.splashImageUrl,
        options: currentQuiz.options,
        quizType: "multiple-choice",
      },
    ]);
  };

  // 주관식 답변 제출 처리
  const handleSubmitAnswer = () => {
    if (isCorrect !== null || isGameOver || !currentQuiz) return;

    const userAnswerTrimmed = inputAnswer
      .trim()
      .replace(/\s+/g, "")
      .toLowerCase();
    const correctAnswerTrimmed = currentQuiz.correctAnswer
      .replace(/\s+/g, "")
      .toLowerCase();

    const correct = userAnswerTrimmed === correctAnswerTrimmed;
    setIsCorrect(correct);

    if (correct) {
      setScore((prev) => prev + 100);
    }
    setAnsweredQuizzes((prevAnswered) => [
      ...prevAnswered,
      {
        quizId: currentQuiz.id,
        questionText: currentQuiz.correctAnswer, // IQuiz의 correctAnswer를 문제 텍스트로 우선 사용
        userAnswer: inputAnswer,
        correctAnswer: currentQuiz.correctAnswer,
        isCorrect: correct,
        splashImageUrl: currentQuiz.splashImageUrl,
        quizType: "short-answer",
      },
    ]);
  };

  // 다음 문제로 이동
  const handleNextQuiz = () => {
    const nextIndex = currentQuizIndex + 1;

    if (nextIndex >= quizzes.length) {
      setIsGameOver(true);
    } else {
      setCurrentQuizIndex(nextIndex);
      setSelectedOption(null);
      setInputAnswer("");
      setIsCorrect(null);
      setTimeLeft(15);
    }
  };

  // 입력 변경 처리
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputAnswer(e.target.value);
  };

  // Context 값
  const value = {
    quizzes,
    currentQuiz,
    currentQuizIndex,
    selectedOption,
    inputAnswer,
    isCorrect,
    score,
    timeLeft,
    isGameOver,
    isLoading,
    error: error as Error | null,
    inputRef,
    totalQuizzes: quizzes.length,
    quizType,
    completionTime,
    answeredQuizzes, // context value에 추가
    handleOptionSelect,
    handleSubmitAnswer,
    handleNextQuiz,
    handleInputChange,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};

// Context 훅
export const useQuizContext = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error(
      "useQuizContext는 QuizProvider 내부에서만 사용할 수 있습니다."
    );
  }
  return context;
};
