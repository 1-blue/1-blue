# Slack 알림 (1-blue monorepo)

## 설정

1. Slack App 하나 생성 (Incoming Webhooks 활성화)
2. 채널마다 Webhook URL 발급
3. 각 앱 `.env.local`에 `SLACK_WEBHOOK_URL` 설정

```env
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T.../B.../xxx
```

Webhook이 없으면 `notifySlack`은 조용히 skip합니다.

## 앱별 사용

| 앱 | 트리거 | 메시지 예시 |
|----|--------|-------------|
| web-daily-deduction | Cron `generate-ahead` | `오늘의 추론: 퍼즐 3일치 생성 완료 (2026-06-24)` |
| web-daily-deduction | Admin `generate-puzzles` | `오늘의 추론: 수동 생성 완료 (dates: …)` |
| web-daily-doodle | Cron `close-day` | (해당 앱 정책에 따름) |

## 코드 패턴

```typescript
export const notifySlack = async (text: string): Promise<void> => {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) return;
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
};
```

## 보안

- Webhook URL을 커밋하지 않음 (`.env.example`에는 빈 값만)
- 실패 스택트레이스 전체 대신 `error.message` 수준만 전송
