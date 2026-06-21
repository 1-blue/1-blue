# External Checklist (통합)

플랫폼별 수동 작업 목록입니다. 템플릿 README에 상세 순서가 있습니다.

## Vercel + AdSense (web-static / web-api)

### Before CLI

- [ ] Vercel 계정 + GitHub 연동
- [ ] (선택) Google AdSense 계정

### After CLI

- [ ] Vercel New Project → Root Directory = `apps/web-{slug}`
- [ ] Environment variables (web-api: Supabase keys)
- [ ] AdSense: 사이트 등록 → `public/ads.txt`
- [ ] Privacy/Terms 페이지 확인

### Before Launch

- [ ] Lighthouse 모바일 점수
- [ ] AdSense 승인 대기

## AIT (토스)

### Before CLI

- [ ] [AIT 콘솔](https://developers-apps-in-toss.toss.im/) 가입
- [ ] 앱 등록 (`appName` 확정)
- [ ] 샌드박스 앱 설치

### After CLI

- [ ] `npx ait build` → `.ait` 업로드
- [ ] QR 샌드박스 테스트
- [ ] 검수 요청 (3~5 영업일)

### Before Monetization

- [ ] 개인사업자 등록
- [ ] 콘솔 사업자·정산 정보
- [ ] AIT 인앱 광고 SDK 연동

## Play Store + AdMob

### Before CLI

- [ ] Google Play Console ($25)
- [ ] AdMob 계정
- [ ] Expo/EAS 계정

### After CLI

- [ ] Vercel prod URL 배포 완료
- [ ] `eas build --platform android`
- [ ] AdMob App ID → `app.json`
- [ ] Play Console 내부 테스트

## Supabase

- [ ] 프로젝트 생성 (free → Pro upgrade path)
- [ ] `supabase db push` migrations
- [ ] Vercel env: `NEXT_PUBLIC_SUPABASE_*`
