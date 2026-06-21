---
name: plan-service
description: >-
  Plans new 1-blue Factory apps before implementation. Picks awesome-design-md
  DESIGN.md, writes Stitch prompts, SEO long-tail strategy, slug and APP.md draft.
  Use when the user mentions wanting to create a project, app idea, service topic,
  or asks for strategy before coding. Phase 1 only — no scaffold or code unless
  the user explicitly approves Phase 2 (계획 세워줘, 승인, 진행해줘).
---

# plan-service

1-blue Factory **사전 전략** 스킬. 구현(create-service) **이전** 단계.

## Two-phase workflow

| Phase | Trigger | Agent does | Agent must NOT |
|-------|---------|------------|----------------|
| **1 · 전략** | "○○ 앱 만들고 싶어", 주제·아이디어 언급 | 전략 패키지 응답 (한국어) | `create:app`, 코드 편집, commit |
| **2 · 실행** | "계획 세워줘", "승인", "진행해줘" | 실행 계획 → 승인 후 `create-service` + `apply-design` | Phase 1 없이 바로 구현 (사용자가 명시적으로 스킵 요청한 경우 제외) |

Phase 2 시작 시: [create-service](../create-service/SKILL.md) → [apply-design](../apply-design/SKILL.md) 순서.

## Phase 1 — respond with this structure

Always **한국어**. 아래 섹션을 빠짐없이:

### 1. 앱 정의

- `slug`, `name`, `type` (`web-static` | `web-api` | `ait` | `expo`)
- 한 줄 가치 제안
- Factory 형제 앱과 UI 쉘 공유 가능 여부

### 2. DESIGN.md 추천

- **Primary** — [awesome-design-md](https://github.com/VoltAgent/awesome-design-md/tree/main/design-md) 에서 1개 + GitHub raw URL + 선택 이유 (2~3문장)
- **Secondary** (선택) — 보조 1개
- Factory 메모: 동일 DESIGN 쉘을 여러 slug에 재사용할지

Raw URL pattern:

```text
https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/design-md/{name}/DESIGN.md
```

### 3. Stitch 프롬프트

- copy-paste 가능한 **전체 프롬프트** (한국어 UI copy)
- 맨 위에: attach chosen DESIGN.md + 공통 디자인 지시
- shadcn 호환, 모바일 우선, AdSense placeholder 2곳 (web-static)
- [examples.md](./examples.md) 패턴 참고

### 4. SEO 롱테일

- Primary `<title>` / H1 후보
- 키워드 5개 표 (우선순위 | 롱테일 | 페이지 반영 위치)
- FAQ 3~5개 bullet
- 경쟁 사이트 대비 차별점 1~2줄

SEO 원칙:

- 헤드 키워드(예: "날짜 계산기")보다 **구체적 롱테일** (예: "100일 후 날짜")
- **앱 1개 = 검색 의도 1개**
- title, H1, meta description, FAQ는 **같은 키워드 클러스터**

### 5. APP.md 초안

- 기능 목록, 프리셋/엣지 케이스, `@1-blue/core`에 둘 로직

### 6. 당신이 할 일 (사용자)

- Stitch에서 디자인 → URL 또는 스크린샷
- `apps/web-{slug}/DESIGN.md` 에 Stitch URL + design 토큰 요약 저장
- (Phase 2 전) `.env.local` 은 create-app 이후

### 7. 다음 메시지

Phase 2로 넘길 때 사용자가 보낼 **정확한 문장** 예시 1줄.

## DESIGN.md selection (quick)

| App topic | Prefer | Why |
|-----------|--------|-----|
| Date / calendar / countdown | `cal` | Calendar-first, card surfaces |
| Minimal utility / tool | `linear.app`, `vercel` | Clean, fast-scan UI |
| FAQ / docs-heavy | `notion`, `mintlify` | Reading-optimized |
| Fintech | `stripe`, `wise` | Trust, forms |
| Consumer / mobile | `apple`, `airbnb` | Touch-friendly |

Full catalog: [reference.md](./reference.md)

## Stitch common block (prepend to every prompt)

```text
Attached DESIGN.md: {design-name} design system from awesome-design-md.
Follow strictly:
- Use semantic colors and radii from DESIGN.md (do not invent a new palette)
- Mobile-first, max-width ~480px on mobile, ~720px on desktop
- shadcn/ui compatible: Card, Button, Calendar, Input, Switch, Accordion, Tabs
- Korean UI copy
- web-static: two ad placeholder zones — dashed gray box ~320×100 below hero and below main result
- Footer: dark surface with privacy / terms links
- No dark mode unless DESIGN.md specifies
- Touch targets ≥ 44px
```

## Phase 2 handoff checklist

When user approves:

1. Confirm `DESIGN.md` + Stitch URL exist in app folder (or template path user specifies)
2. Run `pnpm create:app --type {type} --slug {slug} --name "{name}"`
3. Fill `APP.md`, merge Stitch + awesome-design-md into `DESIGN.md`
4. Implement `@1-blue/core` + Vitest
5. Implement UI via `apply-design` (`_components`, `@1-blue/ui`)
6. SEO metadata + FAQ section on page
7. `pnpm --filter web-{slug} test` / `lint` / `typecheck` / `build`

## Do NOT (Phase 1)

- Run `pnpm create:app` or edit app source
- Commit unless user asks
- Skip SEO or Stitch sections when user asked for full strategy

## Additional resources

- [reference.md](./reference.md) — design-md catalog, external links
- [examples.md](./examples.md) — days-between / date-after-days example pack
