# Web Launch Checklist

## 배포 전

- registry의 slug, port, template 확인
- production build 성공
- 필수 env 이름과 server/client 노출 경계 확인
- `/privacy`, `/terms`, `/robots.txt`, `/sitemap.xml` 확인
- 공개 route의 canonical과 noindex route 확인
- 오류 페이지와 빈 상태 확인
- AdSense 적용 앱은 정책상 충분한 콘텐츠와 ads.txt 확인

## Vercel

- project name: `ob-{slug}`
- Root Directory: `apps/web-{slug}`
- framework preset과 build command는 앱 설정을 우선
- production env 등록
- 배포 URL: `https://ob-{slug}.vercel.app`

배포 후 health/API, 홈, 주요 동적 route, mobile layout, response header를 확인한다.

## Google Search Console

1. URL-prefix property 추가
2. HTML tag 또는 지원되는 소유권 방식 적용
3. `/sitemap.xml` 제출
4. canonical과 indexing 가능 여부 검사

## 네이버 Search Advisor

1. site 추가와 소유권 확인
2. robots.txt 검증
3. sitemap 제출
4. 주요 페이지 수집 요청

## Google AdSense

1. site 추가
2. publisher ID와 ads.txt 일치 확인
3. production script와 slot 확인
4. privacy/terms/contact 접근 확인
5. 심사 제출 후 상태를 `대기`로 기록
