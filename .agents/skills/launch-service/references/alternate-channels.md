# Alternate Channels

웹/Vercel 이외 채널은 사용자가 명시했을 때만 적용한다.

## AIT

- `_template-ait`와 최신 Apps in Toss 문서를 먼저 확인한다.
- SSR이나 외부 URL hosting을 전제하지 않는다.
- `ait build` 결과, sandbox QR, console 검수 순서로 진행한다.
- 사업자·정산 정보가 필요한 광고 단계는 별도 승인과 사용자 작업으로 둔다.

## Expo / Play Store

- `_template-expo`, Expo/EAS, 현재 Play Console 정책을 확인한다.
- WebView가 가리키는 production URL을 먼저 배포·검증한다.
- Android internal testing을 거쳐 production으로 승격한다.
- AdMob app/unit ID는 환경과 native config에서 관리하고 저장소에 비밀값을 넣지 않는다.

외부 플랫폼 정책과 SDK는 변경될 수 있으므로 실행 시점의 공식 문서를 다시 확인한다.
