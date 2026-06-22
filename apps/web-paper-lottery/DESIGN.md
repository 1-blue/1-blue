# Design Guidelines — 온라인 종이뽑기

## Stitch

| 화면 | Node | 앱 경로 | 캡처 |
|------|------|---------|------|
| 랜딩 + 만들기 | [6ca5143f…](https://stitch.withgoogle.com/projects/4725311879240414439?node-id=6ca5143f72d240f988f8df0acb462af5) | `/` | `.stitch/01-landing.png` |
| 주최자 | [9db019b5…](https://stitch.withgoogle.com/projects/4725311879240414439?node-id=9db019b558e54e3ca6b908b6b8daf249) | `/b/[shortCode]/admin` | `.stitch/02-admin.png` |
| 참가자 뽑기 | [e0758577…](https://stitch.withgoogle.com/projects/4725311879240414439?node-id=e07585771e454f3fabbeb6ff37f4a28c) | `/b/[shortCode]/play` | `.stitch/03-play.png` |
| 결과 | [3b048f10…](https://stitch.withgoogle.com/projects/4725311879240414439?node-id=3b048f10a69c471ebcfde4f6b9402c4a) | `/b/[shortCode]/result` | `.stitch/04-result.png` |

Export: [.stitch/manifest.json](./.stitch/manifest.json)

**톤:** 문방구 추억 · 종이 질감 · 스탬프/스티커 · 나무 액자 뽑기판

## Tokens

| Role | Value | Notes |
|------|-------|-------|
| cork | #F2E4C8 | page background |
| paper | #FFF8E7 | card / cell surface |
| cream | #FDF5E6 | clipboard, secondary surface |
| stamp | #C0392B | CTA, stamp text |
| gold | #F4C430 | 1등 highlight |
| ink | #3D2914 | headings |
| wood | #8B5E3C | board frame |
| wood-dark | #5C3D24 | frame inset |
| active | #2ECC71 | 진행 중 badge |
| footer | #2A1F14 | footer background |

## Components

| Stitch 화면 | 구현 컴포넌트 |
|-------------|---------------|
| 공통 | `StitchHeader`, `StitchFooter`, `StitchPageShell` |
| `/` | `HomePage`, `CreateBoardForm`, polaroid hero, FAQ Accordion |
| admin | `AdminDashboard`, `StitchProgressBar`, `PrizeRemainderBar` (price tag), `ParticipantLinkList` |
| play | `PaperBoardGrid` (wood frame), `PaperCell` (paper tab), `TearRevealDialog`, `PickConfirmSheet` |
| result | `ResultSummary` (clipboard winners), `RevealedBoardGrid` |

## Screen notes (from Stitch)

### Landing
- 상단 `문방구뽑기` 스탬프 로고
- 폴라로이드 히어로 + "온라인 종이뽑기" 타이틀
- SETUP 폼: 뽑기판 이름, 인원 수, 등수 구성, 참가자 명단
- 빨간 CTA `뽑기판 만들기`
- FAQ 아코디언 + 다크 푸터

### Admin
- 이벤트 카드: short code + `진행 중` 뱃지 + 제목
- Candy stripe 진행률 바
- Price tag 등수 칩 (`1등 1/2` 형식)
- 참가자 카드 + 완료 스탬프 오버레이
- `전체 참가 링크 복사` (빨간), `수동 마감하기` (베이지)

### Play
- `남은 뽑기 N회` 골드 박스
- 나무 액자 그리드, 종이 탭 셀
- 결과 모달: 축하합니다 + 메달 + `결과함에 담기`
- `내가 뽑은 결과` 리스트

### Result
- `뽑기 완료!` + 클립보드 당첨자 요약
- `결과 링크 복사` CTA
- 전체 보드 그리드 (등수별 색상)

## Animation (framer-motion)

- `PaperCell`: hover lift, taken stamp slam
- `PrizeRemainderBar`: number flip on change
- `PaperBoardGrid`: stagger flip on reveal
- `TearRevealDialog`: rotateY spring + taped card

## Ad slots

1. `landing-hero` — below hero
2. `landing-below-form` — below create form

## Layout

- Mobile-first, max-width 512px
- Grid 5 cols mobile, 6 cols sm+
- Touch targets ≥ 44px (h-11 / h-12 buttons)
