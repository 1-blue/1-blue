# 오늘의 낙서 (daily-doodle)

매일 자정(KST)에 초기화되는 익명 공유 캔버스.

## 기능

- 닉네임만으로 참여 (localStorage)
- 펜·텍스트 도구, 8색 팔레트
- 본인 스트로크만 되돌리기 (최대 20)
- Realtime broadcast 동기화 + presence
- 일일 아카이브 (최근 30일)
- PNG보내기

## API

- `GET /api/boards/today` — 오늘 보드 + 스트로크
- `POST /api/boards/today/strokes` — 스트로크 추가
- `DELETE /api/boards/today/strokes/[id]` — 본인 undo
- `GET /api/archive` — 아카이브 목록
- `GET /api/archive/[date]` — 아카이브 상세
- `GET /api/cron/close-day` — 자정 스냅샷 (CRON_SECRET)

## Core (`@1-blue/core/daily-doodle`)

- KST 날짜, stroke 검증, rate limit, canvas 렌더

## UI

See [DESIGN.md](./DESIGN.md) for Stitch references.
