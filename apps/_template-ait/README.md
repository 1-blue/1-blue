# AIT Template

토스 앱인토스(AIT) 미니앱용 CSR/SSG 정적 빌드 템플릿입니다.

## Before CLI (외부)

1. [AIT 콘솔](https://developers-apps-in-toss.toss.im/) 가입
2. 앱 등록 (`granite.config.ts`의 `appName`과 일치)
3. 샌드박스 앱 설치

## CLI

```bash
pnpm create:app --type ait --slug my-app --name "My App"
pnpm --filter ait-my-app dev
pnpm --filter ait-my-app build:ait
```

## After CLI (외부)

1. 콘솔에 `.ait` 번들 업로드
2. QR 샌드박스 테스트
3. 4단계 검수 요청

## Before Launch (수익)

- 사업자등록 → 콘솔 등록 → AIT 인앱 광고 SDK

## 주의

- SSR/외부 URL 호스팅 **불가** — `.ait` 정적 번들만
- iframe, 외부 redirect 금지
- 유사 앱 중복 금지 (`apps/registry.json` 참조)

통합 체크리스트: [docs/EXTERNAL-CHECKLIST.md](../../docs/EXTERNAL-CHECKLIST.md)
