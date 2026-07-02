# Stitch Prompt 규칙

프롬프트에는 다음 항목을 구체적인 값으로 채운다.

1. 서비스 이름, 사용자 문제, 가장 중요한 행동 한 가지
2. 첨부하거나 참조할 awesome-design-md 이름과 URL
3. DESIGN.md의 색상, typography, radius, spacing 원칙
4. route별 화면과 각 화면의 loading, empty, error, success 상태
5. PC, Tablet, Mobile layout과 navigation 변화
6. shadcn/ui로 대응할 수 있는 component
7. 한국어 실제 UI copy
8. keyboard navigation, focus, contrast, 44px 이상 touch target
9. 광고가 있는 경우 콘텐츠를 방해하지 않는 slot 위치
10. privacy, terms, feedback 등 footer 요구사항

다음 문장을 명시한다.

```text
Treat the attached DESIGN.md as the visual source of truth. Do not invent a competing palette.
Produce complete PC, tablet, and mobile screens unless a platform is explicitly excluded.
Keep components implementable with Next.js, Tailwind CSS, and shadcn/ui.
```

개발 handoff에는 다음을 포함한다.

- Stitch project/screen URL 또는 식별자
- 화면별 screenshot 기준
- 확정 token과 예외
- route와 navigation 관계
- 재사용 component와 가장 가까운 공통 route 위치
- 서버/클라이언트 경계와 데이터 상태
- 구현하지 않을 항목
