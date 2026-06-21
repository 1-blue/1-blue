# Architecture

## Channel Separation

| Channel             | Template               | Build                 | Monetization                       |
| ------------------- | ---------------------- | --------------------- | ---------------------------------- |
| Vercel Web (static) | `_template-web-static` | `next build` (export) | AdSense                            |
| Vercel Web (API)    | `_template-web-api`    | `next build` (SSR)    | AdSense                            |
| AIT (Toss)          | `_template-ait`        | `ait build` → `.ait`  | AIT in-app ads (business required) |
| Play Store          | `_template-expo`       | EAS build             | AdMob (native)                     |

**Important:** AIT cannot use SSR or external URL hosting. Share logic via `packages/core`, not the same Next.js app config.

## Supabase Strategy

- **No DB apps:** No Supabase connection
- **DB apps:** `CREATE SCHEMA app_{slug}` per app
- **30+ apps:** Consider `tenant_id` column pattern (see migration template)

## App Registry

`apps/registry.json` tracks all apps for CI and Agent deduplication.

## Testing

| Layer      | Tool                |
| ---------- | ------------------- |
| core, libs | Vitest              |
| ui         | Storybook           |
| web apps   | Vitest + Playwright |
| ait, expo  | typecheck + build   |
