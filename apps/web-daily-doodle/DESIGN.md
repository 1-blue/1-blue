# Design Guidelines — 오늘의 낙서

## Stitch

| 화면          | Node                                                                                                              | 앱 경로           | 캡처                            |
| ------------- | ----------------------------------------------------------------------------------------------------------------- | ----------------- | ------------------------------- |
| 랜딩 + 캔버스 | [6ca5143f…](https://stitch.withgoogle.com/projects/13232009227563314820?node-id=6c6033007b2b4f21ba2dd81d8a358433) | `/`               | `.stitch/01-landing.png`        |
| 모바일 캔버스 | [3bac12de…](https://stitch.withgoogle.com/projects/13232009227563314820?node-id=3bac12de39794612af1b5c39f45b46a6) | `/` `#canvas`     | `.stitch/02-canvas.png`         |
| 닉네임 Dialog | [fba0f22f…](https://stitch.withgoogle.com/projects/13232009227563314820?node-id=fba0f22f215d4c96900c5e7c3ca37c4e) | overlay           | `.stitch/03-nickname.png`       |
| 아카이브 목록 | [a03c82fb…](https://stitch.withgoogle.com/projects/13232009227563314820?node-id=a03c82fb2f7a42899b20100a1c4d438a) | `/archive`        | `.stitch/04-archive-list.png`   |
| 아카이브 상세 | [3cc6eb98…](https://stitch.withgoogle.com/projects/13232009227563314820?node-id=3cc6eb98d71b4e0880f8223789ae2448) | `/archive/[date]` | `.stitch/05-archive-detail.png` |

Export: [.stitch/manifest.json](./.stitch/manifest.json)

**톤:** 빨래방 방명록 · 공책 낙서장 · 따뜻한 크림 종이

## awesome-design-md base

- Source: `airbnb`
- Raw: https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/design-md/airbnb/DESIGN.md

## Tokens

| Role        | Value   | Notes             |
| ----------- | ------- | ----------------- |
| notebook-bg | #F5EDD6 | page background   |
| paper       | #FFFDF5 | canvas surface    |
| paper-line  | #E8DFC8 | ruled lines       |
| ink         | #3D2914 | headings, body    |
| accent      | #E85D4C | CTA, active tool  |
| mint        | #5CB88A | presence badge    |
| footer      | #2A1F14 | footer background |

## Components

| Stitch 화면       | 구현 컴포넌트                                                 |
| ----------------- | ------------------------------------------------------------- |
| 공통              | `StitchHeader`, `StitchFooter`, `StitchPageShell`             |
| `/`               | `LandingHero`, `DoodleBoard`, `HowItWorksSteps`, `FaqSection` |
| 캔버스            | `DoodleCanvas`, `DoodleToolbar`, `PresenceBadge`, `DateChip`  |
| 닉네임            | `NicknameGate`                                                |
| `/archive`        | `ArchiveList`, `ArchiveDateCard`                              |
| `/archive/[date]` | `ArchiveDetailView`, `ExportPngButton`                        |

## Screen notes (from Stitch)

### Landing (`/`)

- 스탬프 로고 `오늘의 낙서` + `지난 낙서` 링크
- Hero: "매일 함께 그리는 공유 낙서장" / "자정이 되면 오늘의 낙서는 아카이브로, 캔버스는 비워져요"
- Ad `landing-hero` below hero
- 캔버스 카드 3:2, date chip 좌상단, presence 우상단, 하단 플로팅 툴바
- How it works 3단계 카드
- Ad `landing-below-faq` above FAQ
- FAQ 4항 아코디언
- 다크 푸터

### Canvas mobile

- Sticky top: logo, date, presence
- Bottom floating toolbar with safe-area

### Nickname dialog

- 중앙 Dialog, "닉네임을 정해주세요", placeholder "예: 종이배", accent CTA "시작하기"

### Archive list

- "지난 낙서" 헤더, 날짜 카드 그리드 + 썸네일

### Archive detail

- 읽기 전용 배너, PNG 저장 + 오늘 낙서하러 가기

## Ad slots

1. `landing-hero` — below hero subtitle
2. `landing-below-faq` — above FAQ section

## Layout

- Mobile-first, max-width 512px
- Canvas aspect 3:2 (1200×800 logical)
- Touch targets ≥ 44px (h-11 / h-12)
- Dialogs centered (not bottom sheets)
