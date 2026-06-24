"use client";

import { forwardRef, type CSSProperties } from "react";
import { formatKstDateLabel } from "@1-blue/core/daily-deduction";
import type { SubmitResultView } from "@/lib/types";

type ShareResultCardProps = {
  date: string;
  title: string;
  result: SubmitResultView;
};

const cardStyle: CSSProperties = {
  background: "#1e232b",
  color: "#e8eaed",
  padding: "28px 24px",
  borderRadius: "16px",
  fontFamily: "sans-serif",
  width: "400px",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  gap: "24px",
};

const statBoxStyle: CSSProperties = {
  background: "#14181f",
  borderRadius: "12px",
  padding: "14px 10px",
  textAlign: "center",
  flex: 1,
  minWidth: 0,
};

export const ShareResultCard = forwardRef<HTMLDivElement, ShareResultCardProps>(
  ({ date, title, result }, ref) => {
    const correctCount = result.graded.filter((g) => g.correct).length;
    const minutes = Math.floor(result.timeSeconds / 60);
    const seconds = String(result.timeSeconds % 60).padStart(2, "0");

    return (
      <div ref={ref} style={cardStyle}>
        <div>
          <div
            style={{
              width: "40px",
              height: "4px",
              borderRadius: "999px",
              background: "#e89b3c",
              marginBottom: "16px",
            }}
          />
          <p style={{ fontSize: "12px", color: "#9aa4b2", margin: 0, letterSpacing: "0.02em" }}>
            오늘의 추론
          </p>
          <p style={{ fontSize: "13px", color: "#9aa4b2", margin: "6px 0 0" }}>
            {formatKstDateLabel(date)}
          </p>
          <h3
            style={{
              fontSize: "20px",
              fontWeight: 700,
              margin: "12px 0 0",
              color: "#e8eaed",
              lineHeight: 1.4,
              wordBreak: "keep-all",
            }}
          >
            {title}
          </h3>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <div style={statBoxStyle}>
            <p style={{ fontSize: "11px", color: "#9aa4b2", margin: 0 }}>정답</p>
            <p style={{ fontSize: "22px", fontWeight: 700, color: "#22c55e", margin: "6px 0 0" }}>
              {correctCount}/{result.graded.length}
            </p>
          </div>
          <div style={statBoxStyle}>
            <p style={{ fontSize: "11px", color: "#9aa4b2", margin: 0 }}>오답</p>
            <p style={{ fontSize: "22px", fontWeight: 700, color: "#e8eaed", margin: "6px 0 0" }}>
              {result.wrongCount}
            </p>
          </div>
          <div style={statBoxStyle}>
            <p style={{ fontSize: "11px", color: "#9aa4b2", margin: 0 }}>시간</p>
            <p style={{ fontSize: "22px", fontWeight: 700, color: "#e8eaed", margin: "6px 0 0" }}>
              {minutes}:{seconds}
            </p>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid #2a313c",
            paddingTop: "16px",
          }}
        >
          <p style={{ fontSize: "11px", color: "#6b7280", margin: 0 }}>daily-deduction.1-blue.dev</p>
        </div>
      </div>
    );
  },
);

ShareResultCard.displayName = "ShareResultCard";
