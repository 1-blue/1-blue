"use client";

import { useState } from "react";
import { Button } from "@1-blue/ui/components/button";
import { Input } from "@1-blue/ui/components/input";
import { Label } from "@1-blue/ui/components/label";
import { motion } from "framer-motion";
import type { QuizType } from "#src/app/game/_context/QuizContext";

interface RankingFormProps {
  score: number;
  completionTime: number;
  quizType: QuizType;
  onSubmit: () => void;
}

const RankingForm: React.FC<RankingFormProps> = ({
  score,
  completionTime,
  quizType,
  onSubmit,
}) => {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (nickname.trim().length < 2 || nickname.trim().length > 20) {
      setError("닉네임은 2~20자 사이여야 합니다.");
      return;
    }

    if (password.trim().length < 4) {
      setError("비밀번호는 최소 4자 이상이어야 합니다.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/rankings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nickname,
          password,
          score,
          completion_time: completionTime,
          quiz_type: quizType,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "랭킹 등록에 실패했습니다.");
      }

      onSubmit();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "랭킹 등록에 실패했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-4 w-full max-w-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-4">
        <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
          {quizType === "multiple-choice" ? "객관식" : "주관식"} 모드
        </span>
      </div>

      <div className="space-y-2">
        <Label htmlFor="nickname">닉네임 (2~20자)</Label>
        <Input
          id="nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          disabled={isSubmitting}
          placeholder="닉네임을 입력하세요"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">비밀번호 (4자 이상)</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isSubmitting}
          placeholder="비밀번호를 입력하세요"
          required
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="pt-2">
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "등록 중..." : "랭킹 등록하기"}
        </Button>
      </div>
    </motion.form>
  );
};

export default RankingForm;
