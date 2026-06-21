# Web Static Template

Vercel 정적 배포 + Google AdSense용 Next.js 15 템플릿입니다.

## Before CLI (외부)

1. **plan-service** 스킬로 전략 수립 (DESIGN.md, Stitch, SEO)
2. Stitch에서 UI 디자인 → `DESIGN.md`에 URL 저장
3. Google AdSense 계정 (선택, 나중에 가능)
4. Vercel 계정 + GitHub 연동

워크플로: [docs/FACTORY-WORKFLOW.md](../../docs/FACTORY-WORKFLOW.md)

## CLI

```bash
pnpm create:app --type web-static --slug my-app --name "My App"
pnpm --filter web-my-app dev
pnpm --filter web-my-app test
pnpm --filter web-my-app test:e2e
```

## After CLI (외부)

1. Vercel: New Project → Root Directory `apps/web-{slug}` → Deploy
2. 커스텀 도메인 (선택)
3. AdSense: 사이트 추가 → `public/ads.txt` 갱신 → 승인 대기
4. `/privacy`, `/terms` 페이지 URL 노출 확인

## Before Launch

- Lighthouse / 모바일 UX
- AdSense 정책 (콘텐츠 최소량)

통합 체크리스트: [docs/EXTERNAL-CHECKLIST.md](../../docs/EXTERNAL-CHECKLIST.md)
