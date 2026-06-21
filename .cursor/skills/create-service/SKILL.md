---
name: create-service
description: >-
  Phase 2 implementation orchestration. Run after plan-service approval.
  Reads DESIGN.md and APP.md, scaffolds via create:app, implements core + UI.
  Triggers: 서비스 만들어줘, slug, 승인, 진행해줘, 시작 계획 (with approval).
---

# create-service

## When to use

- User **approved** Phase 2 after [plan-service](../plan-service/SKILL.md) strategy
- Or explicitly asks to implement with existing `DESIGN.md` / `APP.md`

If user only mentions an idea with no approval → use **plan-service** first, not this skill.

## Two-phase context

| Phase | Skill |
|-------|-------|
| 1 · Strategy | plan-service |
| 2 · Implement | create-service → apply-design |

## Steps

1. Read `apps/{prefix}-{slug}/APP.md` and `DESIGN.md` (Stitch URL + awesome-design-md tokens)
2. Pick template: `web-static` | `web-api` | `ait` | `expo`
3. If app folder missing: `pnpm create:app --type {type} --slug {slug} --name "{name}"`
4. Copy env: `cp apps/web-{slug}/.env.example apps/web-{slug}/.env.local` (web)
5. Implement pure logic in `packages/core` + Vitest
6. Implement UI in app `_components` via [apply-design](../apply-design/SKILL.md)
7. SEO: metadata, H1, FAQ from APP.md
8. SEO infra: `_config/site-seo.ts` (keywords, FAQ, sitemap paths), `sitemap.ts`, `robots.ts`, `FaqJsonLd` on home page
9. Verify: `test`, `lint`, `typecheck`, `build` for the app filter

## Reference

See [reference.md](./reference.md)
