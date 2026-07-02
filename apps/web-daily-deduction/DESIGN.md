# Design Guidelines — 오늘의 추론

## Stitch

| #   | 화면                       | Node                                                                                                            | 앱 경로 / 상태  | 캡처                                |
| --- | -------------------------- | --------------------------------------------------------------------------------------------------------------- | --------------- | ----------------------------------- |
| 1   | 랜딩 (desktop)             | [8620b725…](https://stitch.withgoogle.com/projects/639365875578086580?node-id=8620b7250e9949c3b5f06379752f7ee1) | `/` Intro       | `.stitch/01-landing-desktop.png`    |
| 2   | 랜딩 (mobile)              | [a6795508…](https://stitch.withgoogle.com/projects/639365875578086580?node-id=a679550817b0457795427937adaed552) | `/` Intro       | `.stitch/02-landing-mobile.png`     |
| 3   | 단서 암기 (desktop)        | [0d5468a1…](https://stitch.withgoogle.com/projects/639365875578086580?node-id=0d5468a11cde4927a7b329c888de9203) | `/` memory      | `.stitch/03-memory-desktop.png`     |
| 4   | 열람 모드 플레이 (desktop) | [c0b58c11…](https://stitch.withgoogle.com/projects/639365875578086580?node-id=c0b58c1124ca4e2dae247d1d8609eff4) | `/` play-open   | `.stitch/04-play-open-desktop.png`  |
| 5   | 결과 (desktop)             | [dde9882e…](https://stitch.withgoogle.com/projects/639365875578086580?node-id=dde9882e0ac84e739efaf3f1e7c5d641) | `/` result      | `.stitch/05-result-desktop.png`     |
| 6   | 단서 암기 (mobile)         | [822b1934…](https://stitch.withgoogle.com/projects/639365875578086580?node-id=822b193480e1414a81fb7be3797220eb) | `/` memory      | `.stitch/06-memory-mobile.png`      |
| 7   | 결과 (mobile)              | [b6f4fc18…](https://stitch.withgoogle.com/projects/639365875578086580?node-id=b6f4fc1887b248579a34c5b110affca7) | `/` result      | `.stitch/07-result-mobile.png`      |
| 8   | 암기 모드 플레이 (mobile)  | [bf33760d…](https://stitch.withgoogle.com/projects/639365875578086580?node-id=bf33760de8004493932f447ba86793e0) | `/` play-memory | `.stitch/08-play-memory-mobile.png` |

Export: [.stitch/manifest.json](./.stitch/manifest.json)

**Stitch 없음 — extrapolate:** `/ranking`, `/archive`, `/archive/[date]`

**톤:** 다크 브리핑룸 · 추리 게임 · 단서 카드(크림 종이)

## awesome-design-md base

- Source: `linear.app` (구조·간격)
- 커스텀 다크 팔레트 오버레이

## Tokens

| Role       | Value             | Notes            |
| ---------- | ----------------- | ---------------- |
| page-bg    | #0F1419 ~ #1A120B | 페이지 배경      |
| surface    | #1E232B           | 카드·패널        |
| clue-paper | #F2EDE4           | 단서 카드        |
| ink        | #E8EAED           | 본문 (다크 위)   |
| ink-muted  | #9AA4B2           | 보조 텍스트      |
| accent     | #E69B5D / #F59E0B | CTA·타이머·선택  |
| danger     | #DC2626           | 오답·FAKE 스탬프 |
| success    | #22C55E           | 정답             |
| rank-gold  | #F4C430           | 랭킹 상위        |
| footer     | #0A0E14           | 푸터             |

## Components

| Stitch 화면       | 구현 컴포넌트                                     |
| ----------------- | ------------------------------------------------- |
| 공통              | `StitchHeader`, `StitchFooter`, `StitchPageShell` |
| `/` Intro         | `HomePage`, `TodaySetCard`, `ModeSelector`        |
| memory            | `MemoryPhase`                                     |
| play              | `CluePanel`, `QuestionPager`, `PlayTimer`         |
| result            | `ResultPanel`, `FakeClueCard`, `ShareResultCard`  |
| `/ranking`        | `RankingPage`                                     |
| `/archive`        | `ArchiveListPage`                                 |
| `/archive/[date]` | `ArchivePlayPage`                                 |

## Stitch 대비 조정

- 헤더 프로필 아이콘 제거 — 우측 `랭킹` `아카이브` 링크만
- 열람 모드: 전체 단서 스크롤 (잠금 UI 없음)
- 암기 플레이: 단서 펼치기 버튼 없음
- UI 카피 한국어 통일
- 풀이 시간은 랭킹용으로 항상 측정

## Ad slots

1. `landing-hero` — 오늘의 세트 카드 아래
2. `landing-below-faq` — FAQ 위
