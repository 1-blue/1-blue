# Design Guidelines — 시험폼

## Stitch

| #   | 화면          | Node                                                                                                              | 앱 경로                                | 캡처                             |
| --- | ------------- | ----------------------------------------------------------------------------------------------------------------- | -------------------------------------- | -------------------------------- |
| 1   | 랜딩 desktop  | [c475d718…](https://stitch.withgoogle.com/projects/11575694827715051887?node-id=c475d718390f4f98a2f4d95ce6302bde) | `/`                                    | `.stitch/01-landing-desktop.png` |
| 2   | 랜딩 mobile   | [c31cbb04…](https://stitch.withgoogle.com/projects/11575694827715051887?node-id=c31cbb04efec407884f63e9b3a1fc68d) | `/`                                    | `.stitch/02-landing-mobile.png`  |
| 3   | CBT 만들기    | [fb69ffd5…](https://stitch.withgoogle.com/projects/11575694827715051887?node-id=fb69ffd5a62643b68c8a1a488d3bc44e) | `/create` (mobile)                     | `.stitch/03-create-metadata.png` |
| 4   | 문제 편집     | [78fc7adb…](https://stitch.withgoogle.com/projects/11575694827715051887?node-id=78fc7adb78154accb6ac99cb471ea23c) | `/create/questions`                    | `.stitch/04-editor.png`          |
| 5   | 생성 완료     | [8156cecc…](https://stitch.withgoogle.com/projects/11575694827715051887?node-id=8156cecc8b8c464a982f306d61eaac05) | `/create/complete`                     | `.stitch/05-create-complete.png` |
| 6   | 관리 대시보드 | [7064fdb1…](https://stitch.withgoogle.com/projects/11575694827715051887?node-id=7064fdb164a147a8bfa0ac123481993a) | `/manage/[admin_token]`                | `.stitch/06-manage.png`          |
| 7   | CBT 수정      | [b88c3f29…](https://stitch.withgoogle.com/projects/11575694827715051887?node-id=b88c3f29b8294af6b59f36872906aa29) | `/manage/[admin_token]/edit`           | `.stitch/07-manage-edit.png`     |
| 8   | 통계          | [d8232a62…](https://stitch.withgoogle.com/projects/11575694827715051887?node-id=d8232a6216d04dc190b41779faff0f08) | `/manage/[admin_token]/stats`          | `.stitch/08-stats.png`           |
| 9   | 응시 랜딩     | [348be789…](https://stitch.withgoogle.com/projects/11575694827715051887?node-id=348be789b1f141acb4c746451ebcd0fe) | `/cbt/[public_id]`                     | `.stitch/09-exam-intro.png`      |
| 10  | 시험 풀이     | [52cb6b26…](https://stitch.withgoogle.com/projects/11575694827715051887?node-id=52cb6b26c8aa469eb53bb4cefbd5e174) | `/cbt/[public_id]/take`                | `.stitch/10-exam-take.png`       |
| 11  | 결과·리뷰     | [73d18705…](https://stitch.withgoogle.com/projects/11575694827715051887?node-id=73d18705add44dc29cb19d42510ef7b9) | `/cbt/[public_id]/result/[attempt_id]` | `.stitch/11-exam-result.png`     |

Export: [.stitch/manifest.json](./.stitch/manifest.json)

**톤:** linear.app 기반 밝은 UI · primary `#2563EB` · footer `#1F2937`

## Components

| 영역 | 컴포넌트                                                                              |
| ---- | ------------------------------------------------------------------------------------- |
| 공통 | `PageShell`, `PageHeader`, `PageFooter`, `CopyLinkButton`, `StatusBadge`, `MetaChips` |
| 생성 | `CbtMetadataForm`, `BasicSettingsSidebar`, `CbtQuestionEditor`, `EditorTopBar`        |
| 응시 | `CbtIntroPage`, `CbtTakePage`, `ResultPage`                                           |

## 의도적 제외

- 주관식·배점 UI (객관식 2~5개만)
- 로그인 버튼
