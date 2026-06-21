# Environment & config (Expo)

Expo는 Next.js `.env` 대신 **`app.json`** 과 EAS 설정을 사용합니다.

## Required config

| Location                                         | Purpose                                                                          |
| ------------------------------------------------ | -------------------------------------------------------------------------------- |
| [`app.json`](./app.json) → `extra.webViewUrl`    | Prod Vercel URL (`https://web-{{SLUG}}.vercel.app`)                              |
| [`app.json`](./app.json) → AdMob plugin          | Android/iOS App ID                                                               |
| [`app.json`](./app.json) → `extra.eas.projectId` | EAS Build                                                                        |
| Dev WebView                                      | `http://10.0.2.2:{{WEB_PORT}}` (Android) / `http://localhost:{{WEB_PORT}}` (iOS) |

## Local dev

```bash
pnpm --filter expo-{{SLUG}} dev
# Metro port: {{EXPO_PORT}}
```

Pair with web app on port **{{WEB_PORT}}** (`pnpm dev:{{SLUG}}`).

Root shortcut: `pnpm dev:{{SLUG}}:expo`

See [docs/EXTERNAL-CHECKLIST.md](../../docs/EXTERNAL-CHECKLIST.md)
