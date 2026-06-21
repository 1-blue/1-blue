# plan-service examples

Reference pack for **date / day-count** long-tail apps (approved direction).

## App 1 — days-between

| Field | Value |
|-------|-------|
| slug | `days-between` |
| name | 두 날짜 일수 계산기 |
| type | `web-static` |
| DESIGN.md | `cal` |

### SEO cluster

- Primary title: `두 날짜 사이 며칠? 일수 계산기 (시작일 포함 옵션)`
- Keywords: 두 날짜 사이 며칠, 날짜 사이 일수 계산, 시작일 종료일 며칠, 며칠 지났는지 계산

### Stitch prompt

```text
Attached DESIGN.md: Cal.com design system from awesome-design-md.

Follow strictly:
- Canvas #ffffff, cards #f5f5f5, primary CTA #111111, footer #101010
- Inter body, display headlines weight 600, rounded-lg (12px) cards
- Mobile-first, max-width 480px centered on mobile, 720px on desktop
- shadcn/ui compatible: Card, Button, Calendar, Input, Switch, Accordion
- Korean UI copy
- Two ad placeholder zones: dashed gray box (320×100) below hero and below result
- Footer: dark with privacy/terms links
- No dark mode
- Touch targets ≥ 44px

Build a single-page Korean web app: "두 날짜 사이 일수 계산기"

Layout (top to bottom):
1. Header: site name "일수 계산", subtitle "시작일과 종료일 사이 며칠인지 바로 계산"
2. Main card (#f5f5f5):
   - "시작일" + date picker
   - "종료일" + date picker
   - Switch: "시작일 포함" (default OFF)
   - Primary button: "일수 계산하기"
3. Result card: large "127일" + date range subtext
4. Ad placeholder
5. FAQ accordion (3 items): 시작일 포함 차이, 종료일이 이전이면, 윤년
6. Dark footer

Beat old dropdown UIs — modern calendar popover. One-task mobile utility.
```

---

## App 2 — date-after-days

| Field | Value |
|-------|-------|
| slug | `date-after-days` |
| name | N일 후·전 날짜 계산기 |
| type | `web-static` |
| DESIGN.md | `cal` (same shell as days-between) |

### SEO cluster

- Primary title: `100일 후 날짜 계산 | N일 후·전 날짜 계산기`
- Keywords: 100일 후 날짜, n일 후 날짜 계산, 30일 후 날짜, 100일 전 날짜, 오늘부터 100일 후

### Stitch prompt

```text
Attached DESIGN.md: Cal.com design system (same Factory shell as days-between).

[same common block as App 1]

Build a single-page Korean web app: "N일 후·전 날짜 계산기"

Layout:
1. Header: "날짜 더하기/빼기", subtitle "100일 후, 30일 전 날짜를 바로 확인"
2. Main card:
   - "기준일" + date picker (default today)
   - Segmented: "일 후" | "일 전"
   - Number input "며칠" + suffix "일"
   - Preset chips: 7일, 30일, 100일, 365일
   - Primary button: "날짜 계산하기"
3. Result: "2026년 3월 31일 (화)" + explanation subtext
4. Ad placeholder
5. FAQ: 100일 후 계산 방법, 일 후/전 차이, 기준일 포함
6. Dark footer

Preset chips target long-tail queries. Mobile-first, no nav menu.
```

---

## Phase 2 trigger (user message example)

```text
days-between Stitch URL 붙였어. 시작 계획 세워줘.
```

Agent should then output execution plan only; wait for "승인" / "진행해줘" before coding.
