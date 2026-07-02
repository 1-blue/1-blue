---
name: design-service
description: 서비스 전략을 바탕으로 awesome-design-md를 선택하고 Google Stitch 프로젝트·디자인 시스템·PC·Tablet·Mobile 화면을 생성·검수해 APP.md·DESIGN.md와 개발 프롬프트를 만든다. 기본 단계형 요청은 Stitch 결과를 보여 주고 구현 승인을 기다리며, 한번에·중간 확인 없이·디자인부터 구현까지 요청한 일괄 모드는 자체 검수와 수정 후 build-service로 즉시 이어간다.
---

# Design Service

제품 전략에서 시각적 source of truth와 구현 handoff를 만든다.

## 실행 모드

- `staged`를 기본값으로 사용한다. Stitch 결과와 검토 내용을 사용자에게 제시하고 명시적 승인 전에는 소스를 구현하지 않는다.
- 사용자가 "한번에", "중간 확인 없이", "디자인부터 구현까지", "끝까지 진행"을 명시하면 `one-shot`을 사용한다. 디자인을 자체 검수·수정한 뒤 같은 작업에서 `$build-service` 절차로 이어간다.
- 모드가 불분명하면 `staged`로 처리한다. 기존 단계형 작업의 후속 메시지에서 "진행해줘"라고 하면 확인된 디자인을 대상으로 구현 승인을 받은 것으로 본다.

## 디자인 프롬프트

1. 전략 결과와 관련 `APP.md`가 있으면 읽는다.
2. awesome-design-md의 [공식 저장소](https://github.com/VoltAgent/awesome-design-md/tree/main/design-md)를 현재 상태로 확인한다.
3. 제품 성격에 가장 맞는 디자인 한 개를 기본으로 고르고, 혼합이 정말 필요할 때만 보조 디자인 한 개를 추가한다.
4. 선택 이유, raw DESIGN.md URL, 핵심 token을 기록한다.
5. [Stitch prompt 규칙](references/stitch-prompt.md)에 따라 전체 프롬프트를 생성한다.
6. 별도 요청이 없으면 PC, Tablet, Mobile 화면과 각 breakpoint의 동작을 모두 포함한다.

## Stitch 실행과 handoff

1. 현재 세션에 Stitch MCP가 있는지 확인한다.
2. 새 서비스면 Stitch 프로젝트를 생성하고, 기존 서비스면 명시된 project를 조회한다.
3. 선택한 DESIGN.md를 업로드해 디자인 시스템을 생성·적용한다. tool schema와 실제 반환 ID를 사용하고 추측하지 않는다.
4. 같은 디자인 시스템으로 PC, Tablet, Mobile 화면을 생성한다.
5. 생성 timeout은 즉시 재시도하지 않고 `get_screen`으로 결과를 확인한다.
6. screen image와 HTML을 전략에 대조해 누락 화면, 접근성, responsive, loading/empty/error/success 상태를 검수한다.
7. 문제를 발견하면 `edit_screens` 또는 variant 생성으로 수정하고 다시 확인한다.
8. 앱이 scaffold된 상태면 `APP.md`, `DESIGN.md` 갱신안을 만든다. 아직 없다면 동일 내용을 개발 handoff로 제공한다.
9. route 목록, 컴포넌트 경계, 데이터 상태, `ROUTES` 요구사항을 포함한 개발 프롬프트를 만든다.
10. `staged`이면 Stitch project/screen과 검수 결과를 제시하고 구현 승인을 기다린다.
11. `one-shot`이면 승인 질문 없이 `$build-service`의 시작 조건으로 개발 handoff를 전달하고 로컬 구현·검증까지 계속한다.

MCP가 없거나 권한이 거부되면 Stitch URL, PC·Tablet·Mobile screenshot 또는 export를 요청한다. 일괄 모드여도 연결을 우회하거나 디자인 결과를 추측하지 않는다.

## 경계

- 디자인 source 없이 새로운 색상과 layout을 임의로 확정하지 않는다.
- Stitch MCP의 tool 이름이나 argument를 추측하지 않는다.
- 단계형 모드의 디자인 단계에서는 앱 scaffold, 소스 수정, 배포를 수행하지 않는다.
- 일괄 모드의 최초 요청은 Stitch 외부 상태 생성과 로컬 구현을 승인하지만 원격 DB, 배포, 결제, 계정 인증까지 승인하지 않는다.
