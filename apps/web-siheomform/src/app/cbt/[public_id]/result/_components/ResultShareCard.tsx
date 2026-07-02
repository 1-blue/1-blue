"use client";

import { forwardRef, type CSSProperties } from "react";

type ResultShareCardProps = {
  title: string;
  score: number;
  passed: boolean;
  correctCount: number;
  totalQuestions: number;
  nickname: string;
};

const cardStyle: CSSProperties = {
  background: "#111827",
  color: "#f9fafb",
  padding: "24px",
  borderRadius: "12px",
  fontFamily: "sans-serif",
  width: "360px",
  boxSizing: "border-box",
};

export const ResultShareCard = forwardRef<HTMLDivElement, ResultShareCardProps>(
  ({ title, score, passed, correctCount, totalQuestions, nickname }, ref) => {
    const passColor = passed ? "#34d399" : "#f87171";

    return (
      <div ref={ref} style={cardStyle}>
        <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>
          {new Date().toLocaleDateString("ko-KR")}
        </p>
        <p style={{ fontSize: "16px", fontWeight: 600, margin: "8px 0 0", lineHeight: 1.4 }}>
          {title}
        </p>
        <p style={{ fontSize: "12px", color: "#9ca3af", margin: "6px 0 0" }}>{nickname}</p>
        <p style={{ fontSize: "36px", fontWeight: 700, margin: "16px 0 0" }}>
          {score}
          <span style={{ fontSize: "18px", color: "#9ca3af" }}> / 100</span>
          <span style={{ fontSize: "14px", color: passColor, marginLeft: "8px" }}>
            {passed ? "PASS" : "FAIL"}
          </span>
        </p>
        <p style={{ fontSize: "13px", color: "#d1d5db", margin: "8px 0 0" }}>
          정답 {correctCount}/{totalQuestions}
        </p>
        <p
          style={{
            fontSize: "11px",
            color: "#6b7280",
            margin: "20px 0 0",
            borderTop: "1px solid #374151",
            paddingTop: "12px",
          }}
        >
          시험폼
        </p>
      </div>
    );
  },
);

ResultShareCard.displayName = "ResultShareCard";
