# 오늘의 추론 (daily-deduction)

매일 새로운 추리 퍼즐 — 암기/열람 모드, FAKE 단서, 객관식 채점, 랭킹.

## 기능

- 암기 모드: 단서 암기 후 단서 없이 풀이
- 열람 모드: 단서를 보면서 풀이
- 객관식 4지선다, 서버 채점
- 오늘 1회 제출 (session_id + DB UNIQUE)
- FAKE 단서 결과 공개, PNG 공유 (html2canvas)
- 랭킹: 오답↑ 시간↑ 정렬
- 아카이브: localStorage만, 랭킹 미반영
- Gemini 자동 생성 + 3일 롤링 버퍼

## API

- `GET /api/puzzles/today?sessionId=` — 오늘 세트 (정답·FAKE 숨김)
- `POST /api/puzzles/today/submit` — 채점·저장
- `GET /api/puzzles/ranking?date=&sessionId=` — 랭킹
- `GET /api/archive` — 목록
- `GET /api/archive/[date]` — 과거 세트
- `POST /api/archive/[date]/submit` — 채점만
- `POST /api/admin/generate-puzzles` — ADMIN_SECRET
- `GET /api/cron/generate-ahead` — CRON_SECRET + Slack

## Core (`@/core`)

- KST 날짜, 3일 lookahead, zod 검증, Gemini 파이프라인

## UI

See [DESIGN.md](./DESIGN.md) for Stitch references.

Port: **7004** — `pnpm dev:daily-deduction`
