---
name: write-app-readme
description: apps/*의 실제 코드와 package.json, APP.md, DESIGN.md, ROUTES, 배포·infra 설정을 조사해 한국어 포트폴리오형 README.md를 생성하거나 최신화한다. 앱별 README 작성, 템플릿 README 교체, 구현과 문서 불일치 정리가 필요할 때 사용하며 대표 이미지·기간·배포 URL·외부 문서 링크는 추측하지 않고 확인한다.
---

# Write App README

템플릿 설명이 아니라 현재 앱을 정확하게 보여 주는 공개 문서를 작성한다.

## 조사

1. 대상 앱의 `APP.md`, `DESIGN.md`, package.json, route, API route, `ROUTES`, env example, Vercel 설정을 읽는다.
2. 실제 dependency와 import를 확인해 사용하는 기술만 기술 스택에 넣는다.
3. DB migration, cron, storage, AI provider, realtime 등 주요 구조를 코드로 교차 확인한다.
4. 문서와 코드가 다르면 현재 코드를 기준으로 차이를 사용자에게 알린다.
5. 대표 이미지, 프로젝트 기간, 배포 URL, API 문서, 블로그 링크 중 코드에서 확정할 수 없는 값을 한 번에 질문한다.
6. 필수 외부 값을 받기 전에는 TODO나 가짜 링크가 든 완성본을 만들지 않는다.

## 작성

1. [README template](references/readme-template.md)의 순서와 톤을 사용한다.
2. 앱 성격에 맞지 않는 section은 제거하고 필요한 고유 기능 section은 추가한다.
3. 기술 stack icon은 Simple Icons의 실제 slug와 브랜드 색상을 사용한다. 확인되지 않은 icon URL을 만들지 않는다.
4. `ROUTES`가 있으면 공개 page와 주요 사용자 route 표를 만든다. token·admin secret이 포함된 실제 URL은 노출하지 않는다.
5. 실행 명령은 대상 앱의 package.json과 루트 script에 존재하는 값만 사용한다.
6. 문서 링크는 repository 상대 링크, 외부 링크는 유효한 URL을 사용한다.
7. 생성 후 README의 주장과 코드가 일치하는지 다시 확인하고 Prettier를 검사한다.

## 경계

- template README를 부분 수정해 앱 README인 것처럼 남기지 않는다.
- 설치되어 있지만 사용하지 않는 dependency를 주요 기술로 과장하지 않는다.
- 비밀 env 값, 개인 token, 관리자 URL을 포함하지 않는다.
- README 작성 요청만으로 앱 코드나 설정을 수정하지 않는다.
