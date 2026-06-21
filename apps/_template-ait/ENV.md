# Environment & config (AIT)

AIT는 `.env` 파일을 사용하지 않습니다.

## Required config

| File                                       | Fields                                                   |
| ------------------------------------------ | -------------------------------------------------------- |
| [`granite.config.ts`](./granite.config.ts) | `appName`, `brand`, `web.port` (local dev: **{{PORT}}**) |
| AIT Console                                | 앱 등록명 = `appName`과 일치                             |

## Local dev

```bash
pnpm --filter ait-{{SLUG}} dev
# http://localhost:{{PORT}}
```

Root shortcut: `pnpm dev:{{SLUG}}:ait`

See [docs/EXTERNAL-CHECKLIST.md](../../docs/EXTERNAL-CHECKLIST.md)
