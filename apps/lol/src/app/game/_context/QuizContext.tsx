"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  ReactNode,
} from "react";
import { type IQuiz, useQuizQuery } from "#src/app/game/_hooks/useQuizQuery";

// 퀴즈 타입 정의
export type QuizType = "multiple-choice" | "short-answer";

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
  const {
    data: quizzes = [],
    isLoading,
    error,
  } = useQuizQuery(quizCount, quizType);

  // 퀴즈 상태 관리
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [inputAnswer, setInputAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isGameOver, setIsGameOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // 시간 초과 시 오답 처리
          if (quizType === "multiple-choice") {
            setSelectedOption("");
          } else {
            setInputAnswer("");
          }
          setIsCorrect(false);
          return 0;
        }
        return prev - 1;
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
    if (selectedOption !== null || isGameOver || isCorrect !== null) return;

    setSelectedOption(option);
    const correct = option === currentQuiz?.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setScore((prev) => prev + 100);
    }
  };

  // 주관식 답변 제출 처리
  const handleSubmitAnswer = () => {
    if (isCorrect !== null || isGameOver) return;

    // 띄어쓰기를 제외한 정답 체크
    const userAnswer = inputAnswer.trim().replace(/\s+/g, "").toLowerCase();
    const correctAnswer = currentQuiz?.correctAnswer
      .replace(/\s+/g, "")
      .toLowerCase();

    const correct = userAnswer === correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setScore((prev) => prev + 100);
    }
  };

  // 다음 문제로 이동
  const handleNextQuiz = () => {
    const nextIndex = currentQuizIndex + 1;

    if (nextIndex >= quizzes.length) {
      // 게임 종료
      setIsGameOver(true);
    } else {
      // 다음 문제로
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
