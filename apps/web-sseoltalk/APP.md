# 썰톡 (web-sseoltalk)

AI가 매일 생성하는 카카오톡 스타일 썰을 읽고 반응·댓글을 남기는 익명 커뮤니티.

## Stack

- Next.js 15 (App Router)
- Supabase (`app_sseoltalk`)
- Anthropic (생성) + Gemini (검증) — 기본은 Gemini Pro 생성 + Gemini Flash 검증
- AdSense + `@1-blue/legal`

## 주요 기능

- 메인 피드 / 카테고리 / 인기 / 랜덤
- 썰 상세 (채팅 UI, 반응 4종, 댓글·1뎁스 답글)
- 익명 댓글 (닉네임+비밀번호, 수정/삭제)
- 관리자 API: 썰 생성·발행 (`x-admin-secret`)

## SEO

- Keywords: AI 카톡 썰, 카톡 대화 썰, 익명 썰 커뮤니티
- 동적 sitemap: 공개 썰 상세 URL
- FAQ, WebSite JSON-LD

## Admin API

```bash
curl -X POST http://localhost:7006/api/admin/generate-stories \
  -H "x-admin-secret: $ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"count":3}'

curl -X POST http://localhost:7006/api/admin/publish-stories \
  -H "x-admin-secret: $ADMIN_SECRET"
```
