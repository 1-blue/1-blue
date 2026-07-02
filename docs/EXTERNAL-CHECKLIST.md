# External Checklist

Codex가 코드만으로 완료할 수 없는 계정·인증·심사 작업을 서비스 단계별로 정리한다.

## 구현 전

- [ ] Vercel과 GitHub 연동
- [ ] DB 앱이면 Supabase project와 region 결정
- [ ] AI/storage provider를 사용하면 계정, 비용 한도, key 준비
- [ ] privacy, terms, contact에 들어갈 실제 운영자 정보 확인
- [ ] Google Stitch 디자인 PC·Tablet·Mobile 확인

비밀값은 앱 `.env.local`과 hosting secret에만 넣고 문서·채팅·commit에 기록하지 않는다.

## 로컬 완료 기준

- [ ] test, lint, typecheck, build 성공
- [ ] 주요 happy path와 error/empty state 확인
- [ ] PC, Tablet, Mobile 확인
- [ ] `ROUTES` 기반 navigation, redirect, sitemap 확인
- [ ] `/privacy`, `/terms`, `/robots.txt`, `/sitemap.xml` 확인
- [ ] 실제 구현 기반 앱 README 확인

## Vercel

- [ ] project name `ob-{slug}` 사용 가능 여부 확인
- [ ] Root Directory `apps/web-{slug}`
- [ ] production environment variable 등록
- [ ] `https://ob-{slug}.vercel.app` production 배포
- [ ] health, 홈, 주요 동적 route, metadata 재검증

로그인, OAuth, 결제, team 권한 요청은 사용자가 직접 완료한다.

## Google Search Console

- [ ] URL-prefix property 추가
- [ ] 소유권 확인
- [ ] `/sitemap.xml` 제출
- [ ] canonical과 indexing 가능 여부 검사

## 네이버 Search Advisor

- [ ] site 추가와 소유권 확인
- [ ] robots.txt 검증
- [ ] sitemap 제출
- [ ] 주요 공개 페이지 수집 요청

## Google AdSense

- [ ] site 등록
- [ ] publisher ID와 `public/ads.txt` 일치
- [ ] production AdSense script 확인
- [ ] 광고 slot과 콘텐츠 간섭 확인
- [ ] privacy, terms, contact 접근 확인
- [ ] 심사 제출 후 상태를 `심사 대기`로 기록

AdSense 등록 전에는 placeholder를 실제 광고로 오인하지 않는다.

## Supabase 원격 작업

- [ ] create/expose migration 검토
- [ ] 사용자 승인 후 migration 적용
- [ ] PostgREST schema 노출과 cache reload 확인
- [ ] role별 대표 CRUD와 RLS 거부 확인
- [ ] 다른 앱 schema에 회귀가 없는지 확인

## 선택 채널

### Apps in Toss

- [ ] AIT console app과 sandbox 준비
- [ ] `.ait` build와 QR test
- [ ] 검수 요청
- [ ] 광고 사용 시 사업자·정산 정보 준비

### Expo / Play Store

- [ ] Expo/EAS와 Play Console 준비
- [ ] WebView production URL 배포
- [ ] Android internal testing
- [ ] AdMob app/unit 등록
- [ ] store listing과 production review
