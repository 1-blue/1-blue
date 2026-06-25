"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type ManageStatsData = {
  attemptCount: number;
  averageScore: number;
  passRate: number;
  scoreBuckets: Array<{ label: string; count: number }>;
  questionRates: Array<{ orderIndex: number; rate: number }>;
  attempts: Array<{ id: string; nickname: string; score: number; submittedAt: string | null }>;
  passingScore: number;
};

type ManageStatsPanelProps = {
  stats: ManageStatsData;
};

export const ManageStatsPanel = ({ stats }: ManageStatsPanelProps) => {
  const questionChart = stats.questionRates.map((q) => ({
    name: `Q${q.orderIndex + 1}`,
    rate: q.rate,
  }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="surface-card p-4">
          <p className="text-muted-foreground text-xs">총 응시자</p>
          <p className="text-2xl font-bold">{stats.attemptCount}명</p>
        </div>
        <div className="surface-card p-4">
          <p className="text-muted-foreground text-xs">평균 점수</p>
          <p className="text-primary text-2xl font-bold">{stats.averageScore}점</p>
        </div>
        <div className="surface-card p-4">
          <p className="text-muted-foreground text-xs">합격률</p>
          <p className="text-2xl font-bold">{stats.passRate}%</p>
        </div>
      </div>

      <div className="surface-card overflow-x-auto p-4">
        <h2 className="mb-4 text-sm font-semibold">점수 분포</h2>
        <div className="h-56 min-w-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.scoreBuckets}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#2563EB" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="surface-card overflow-x-auto p-4">
        <h2 className="mb-4 text-sm font-semibold">문제별 정답률</h2>
        <div className="h-56 min-w-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={questionChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="rate" stroke="#2563EB" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="surface-card overflow-x-auto">
        <h2 className="border-border border-b p-4 text-sm font-semibold">응시자 목록</h2>
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left">
            <tr>
              <th className="p-3">닉네임</th>
              <th className="p-3">점수</th>
              <th className="p-3">응시일</th>
            </tr>
          </thead>
          <tbody>
            {stats.attempts.map((attempt) => (
              <tr key={attempt.id} className="border-border border-t">
                <td className="p-3">{attempt.nickname}</td>
                <td
                  className={`p-3 ${attempt.score < stats.passingScore ? "text-destructive" : ""}`}
                >
                  {attempt.score}점
                </td>
                <td className="text-muted-foreground p-3">
                  {attempt.submittedAt
                    ? new Date(attempt.submittedAt).toLocaleDateString("ko-KR")
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
