# Expo Template

Play Store WebView 셸 + 네이티브 AdMob 템플릿입니다. **Expo Go 불가 — Development Build 필수.**

## Before CLI (외부)

1. Google Play Console ($25)
2. AdMob 계정
3. EAS 계정
4. 대응 Vercel 웹 앱 배포 URL

## CLI

```bash
pnpm create:app --type expo --slug my-app --name "My App"
pnpm --filter expo-my-app dev
```

## After CLI (외부)

1. `app.json` AdMob App ID 갱신
2. `extra.webViewUrl` → prod Vercel URL
3. `eas build --platform android`
4. Play Console 내부 테스트

## Before Launch

- WebView prod URL 배포 완료 확인
- AdMob 정책 준수 (WebView DOM에 광고 삽입 금지 — 네이티브만)

통합 체크리스트: [docs/EXTERNAL-CHECKLIST.md](../../docs/EXTERNAL-CHECKLIST.md)
