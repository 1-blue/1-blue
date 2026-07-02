# Routing Convention

각 앱의 페이지 경로를 하나의 `ROUTES` 상수에서 관리하는 표준이다. 이 규칙은 Next.js 파일 기반 routing을 대체하지 않고, 코드에 반복되는 URL 문자열을 제거한다.

## 위치

```text
apps/web-{slug}/src/app/_constants/routes.ts
```

앱 전체 route가 사용하는 상수이므로 App Router의 최상위 private folder에 둔다. route 한 곳에서만 쓰는 query/hash builder는 해당 route의 `_utils`에 둘 수 있다.

## 기본 형태

```typescript
export const ROUTES = {
  /** 외부 링크 */
  EXTERNAL_LINKS: {
    FEEDBACK: {
      path: "https://forms.example.com/feedback",
      label: "피드백 보내기",
    },
  },

  /** 홈 */
  HOME: {
    path: "/",
    label: "홈",
    sitemap: {
      changeFrequency: "daily",
      priority: 1,
    },
  },

  /** 시험 */
  CBT: {
    label: "시험",
    DETAIL: {
      path: (publicId: string) => `/cbt/${publicId}`,
      label: "시험 상세",
      TAKE: {
        path: (publicId: string) => `/cbt/${publicId}/take`,
        label: "시험 응시",
      },
    },
  },
} as const;
```

## 명명과 구조

- key는 대문자 `SNAKE_CASE`로 작성한다.
- URL segment의 계층을 가능한 한 객체 중첩으로 표현한다.
- 모든 이동 가능한 leaf는 `path`와 사용자에게 표시할 `label`을 가진다.
- 내부 정적 경로는 `/`로 시작하며 trailing slash를 넣지 않는다. 홈만 `/`를 사용한다.
- 동적 경로는 필요한 식별자를 명시적으로 받는 함수로 만든다. `any`와 선택적 식별자를 사용하지 않는다.
- 외부 URL은 `EXTERNAL_LINKS` 아래에 두고 `https://` 절대 URL을 사용한다.
- 개인정보처리방침과 이용약관이 앱 내부 페이지라면 외부 링크가 아니라 `PRIVACY`, `TERMS` route로 선언한다.
- route group `(home)`과 private folder `_components`처럼 실제 URL에 나타나지 않는 이름은 상수 계층에 포함하지 않는다.

## 사용

```tsx
<Link href={ROUTES.HOME.path}>{ROUTES.HOME.label}</Link>;

router.push(ROUTES.CBT.DETAIL.TAKE.path(publicId));

redirect(ROUTES.MANAGE.DETAIL.path(adminToken));
```

다음 위치에서도 동일한 path 또는 builder를 사용한다.

- navigation과 footer
- `router.push`, `router.replace`, `redirect`, `permanentRedirect`
- metadata의 canonical URL
- 공유 링크와 QR URL
- sitemap과 robots 관련 URL
- 테스트의 route 진입 경로

origin이 필요한 URL은 `getAppSiteUrl()`과 route path를 안전하게 결합한다. route 상수에 환경별 origin을 하드코딩하지 않는다.

## Sitemap

검색 노출할 공개 정적 route에만 `sitemap`을 선언한다.

```typescript
sitemap: {
  changeFrequency: "weekly",
  priority: 0.8,
}
```

- 인증, 관리, 작성 중간 단계, token 포함 route, `noindex` 페이지에는 `sitemap`을 두지 않는다.
- 정적 sitemap은 문자열 `path`와 `sitemap` metadata를 가진 route를 수집한다.
- 동적 route는 DB에서 공개 entity와 `updatedAt`을 조회하고 path builder로 URL을 만든다.
- 동적 조회가 실패할 때 정적 항목은 유지하되, 실패를 숨길지 관측할지는 앱 운영 정책에 따른다.
- 함수형 path를 임의의 예시 ID로 정적 sitemap에 넣지 않는다.

## 포함하지 않는 경로

다음 값은 페이지 navigation과 수명주기가 달라 `ROUTES`에 넣지 않는다.

- `/api/*` endpoint
- Server Action 식별자
- S3 object key와 signed URL
- 일시적인 callback URL
- CSS selector와 DOM anchor만을 위한 문자열

페이지에서 재사용되는 hash/query URL은 route path를 기반으로 별도 builder를 만든다.

## 기존 앱 Migration

후속 코드 리팩터링에서 앱별로 다음 순서를 따른다.

1. App Router 디렉터리와 실제 공개 페이지를 대조한다.
2. `ROUTES`에 정적·동적·외부 route를 정의한다.
3. `Link`, router, redirect, canonical, 공유 URL의 하드코딩을 교체한다.
4. 기존 `SITEMAP_PATHS`를 제거하고 `ROUTES`의 path와 sitemap metadata를 사용한다.
5. 동적 sitemap이 repository 결과와 route builder를 사용하는지 확인한다.
6. route builder 단위 테스트와 주요 navigation E2E를 추가한다.

이번 정책 문서 도입만으로 기존 앱 코드를 변경하지 않는다.
