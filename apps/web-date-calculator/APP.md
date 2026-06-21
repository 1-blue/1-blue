# 날짜 계산기

## Overview

- Slug: date-calculator
- Template: web-static
- Channel: Vercel + AdSense
- Dev port: 7001

## Value

두 날짜 사이 며칠인지, N일 후·전 날짜를 모바일에서 바로 계산

## Features

- Tab 일수: 시작일, 종료일, 시작일 포함 → 일수
- Tab 더하기/빼기: 기준일, 일 후/전, N일, 프리셋(7·30·100·365) → 결과 날짜
- FAQ 5개 (SEO)
- AdSense placeholder 2곳

## Core logic (@1-blue/core)

- `countDaysBetween(start, end, { includeStart })`
- `addCalendarDays(base, days)`
- `normalizeDate(date)`

## SEO (long-tail)

- Primary title: `날짜 계산기 | 두 날짜 사이 며칠 · 100일 후 날짜 계산`
- H1: `날짜 계산기`
- Meta description: `시작일과 종료일 사이 며칠인지, 100일 후·30일 전 날짜를 바로 계산하는 무료 날짜 계산기. 시작일 포함 옵션 지원.`
- Keywords: 두 날짜 사이 며칠, 날짜 사이 일수 계산, 100일 후 날짜, n일 후 날짜, 30일 후 날짜 → `_config/site-seo.ts`
- FAQ JSON-LD + sitemap/robots: `sitemap.ts`, `robots.ts`, `FaqJsonLd.tsx`

## Design

See [DESIGN.md](./DESIGN.md) — Stitch URL + cal tokens

## Env

```bash
cp .env.example .env.local
```

Run: `pnpm dev:date-calculator`

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_ADSENSE_CLIENT_ID` (optional)
