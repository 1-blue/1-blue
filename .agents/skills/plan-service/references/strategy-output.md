# 전략 출력 형식

## 앱 정의

- 이름과 kebab-case slug
- 실행 모드: `staged` 또는 `one-shot`과 선택 근거
- 한 줄 가치 제안
- 대상 사용자와 해결하는 문제
- `web-static` 또는 `web-api` 권장과 근거
- 기존 Factory 앱과의 중복 여부

## 핵심 범위

- 반드시 필요한 기능
- 첫 버전에서 제외할 기능
- 주요 route와 공개/noindex 구분
- 오류·빈 상태·모바일 사용에서 중요한 edge case

## SEO

- primary title, H1, meta description
- 동일 검색 의도에 속하는 long-tail keyword 5개 안팎
- FAQ 3~5개
- 경쟁 서비스와 다른 한 가지 가치

## 운영과 수익화

- DB, AI API, cron, storage 필요 여부
- 비용·rate limit·moderation 위험
- AdSense 적합성과 승인 전 필요한 콘텐츠

## 외부 선행 작업

사용자가 직접 준비할 계정, API key, 콘텐츠, 정책 결정을 구현보다 먼저 나열한다.

## Design handoff

`$design-service`가 사용할 제품 요약과 반드시 포함할 PC·Tablet·Mobile 화면을 제안한다. `staged`이면 디자인 확인에서 멈출 것을, `one-shot`이면 자체 디자인 검수 후 `$build-service`로 이어갈 것을 명시한다.
