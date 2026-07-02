# @1-blue/legal

공통 이용약관·개인정보처리방침 템플릿과 운영자 연락처 상수를 제공합니다.

## SITE_OPERATOR

[`src/operator.ts`](src/operator.ts)의 `SITE_OPERATOR`를 수정하면 아래에 반영됩니다.

- 모든 앱 `/privacy`, `/terms` 문구 (개인정보 보호책임자, 문의 이메일, 카카오 URL)
- `@1-blue/ui` `OperatorContactLinks` (푸터 이메일·카카오 링크)
- 앱 FAQ 등 `SITE_OPERATOR`를 import하는 곳

앱별로 바꿀 것은 `serviceName`, `effectiveDate`뿐입니다.

```ts
import { createLegalPageProps } from "@1-blue/legal/operator";
import { getPrivacyPolicySections } from "@1-blue/legal/content";

const sections = getPrivacyPolicySections(
  createLegalPageProps({ serviceName: "온라인 종이뽑기", effectiveDate: "2026-06-22" }),
);
```

## Export

| 경로                     | 용도                                           |
| ------------------------ | ---------------------------------------------- |
| `@1-blue/legal`          | content + operator re-export                   |
| `@1-blue/legal/content`  | `getPrivacyPolicySections`, `getTermsSections` |
| `@1-blue/legal/operator` | `SITE_OPERATOR`, `createLegalPageProps`        |

변경 후 `pnpm --filter @1-blue/legal build`를 실행하세요.
