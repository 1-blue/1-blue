---
name: launch-service
description: 로컬 검증을 통과한 1-blue 웹 앱을 Vercel의 ob-{slug}.vercel.app 프로젝트로 배포하고 Google Search Console, 네이버 Search Advisor, Google AdSense 등록을 순서대로 진행·검증한다. 사용자가 배포·출시·검색 등록·광고 등록을 명시적으로 요청할 때 사용하며 로그인·소유권 확인·심사 제출 단계에서는 사용자 참여를 요청한다.
---

# Launch Service

검증된 웹 앱을 되돌릴 수 있는 단계로 나누어 출시한다.

## 시작 조건

1. 대상 앱과 slug를 확인한다.
2. test, lint, typecheck, build 결과와 PC·Tablet·Mobile 로컬 확인을 검토한다.
3. `APP.md`, `README.md`, privacy, terms, robots, sitemap, ads.txt 상태를 확인한다.
4. 필요한 env 이름과 Vercel project 연결을 확인하되 값은 출력하지 않는다.
5. 실패한 필수 검증이 있으면 배포하지 않고 원인을 보고한다.

## 웹 출시

[web launch checklist](references/web-launch-checklist.md)를 순서대로 수행한다.

1. 사용자 승인 후 Vercel project를 `ob-{slug}`로 만들거나 기존 project를 확인한다.
2. Root Directory를 `apps/web-{slug}`로 설정하고 필요한 env를 등록한다.
3. production 배포 후 `https://ob-{slug}.vercel.app` health, 주요 route, metadata, sitemap, robots를 확인한다.
4. Google Search Console에 property와 sitemap을 등록한다.
5. 네이버 Search Advisor에 site 소유권과 sitemap/robots를 등록한다.
6. Google AdSense에 site를 등록하고 ads.txt, script, slot, privacy/terms를 확인한다.
7. 각 단계의 완료·대기·사용자 작업 상태를 체크리스트로 보고한다.

## 사용자 참여

- Google/Vercel/Naver 로그인, 결제, OAuth, DNS, 소유권 확인, 약관 동의, 심사 제출을 대신 가정하지 않는다.
- 사용자 조치가 필요하면 정확한 화면, 입력값의 출처, 완료 후 확인할 결과를 안내하고 기다린다.
- Search Console과 AdSense 승인 상태를 성공으로 과장하지 않는다.

## 다른 채널

사용자가 AIT 또는 Play Store를 명시했을 때만 [alternate channels](references/alternate-channels.md)를 읽는다. 기본 웹 출시에서 해당 단계를 실행하지 않는다.
