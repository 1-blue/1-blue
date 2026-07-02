# DESIGN.md — 썰톡

## Stitch

| 화면      | URL                                                                                                  |
| --------- | ---------------------------------------------------------------------------------------------------- |
| 메인 피드 | https://stitch.withgoogle.com/projects/10675356784138371733?node-id=b096c4ca5bc34d958ab62fbc01a77620 |
| 인기      | https://stitch.withgoogle.com/projects/10675356784138371733?node-id=49583af918b94f3581df0c75652230b9 |
| 카테고리  | https://stitch.withgoogle.com/projects/10675356784138371733?node-id=323fb2fa137b484299a239d646a76e99 |
| 상세      | https://stitch.withgoogle.com/projects/10675356784138371733?node-id=a7f484bd738540efacb6150656519f3f |
| 상태      | https://stitch.withgoogle.com/projects/10675356784138371733?node-id=a884d3f7b320406eb2fb7c0dac061c23 |

## 톤

- 다크 모드 기본
- Primary: `#8B7BFF`
- Background: `#0E1014`, Surface: `#181B21`

## 한국어 라벨 치환

| Stitch (EN)         | UI (KO)   |
| ------------------- | --------- |
| SseolTalk           | 썰톡      |
| Home                | 메인      |
| Popular             | 인기      |
| Category            | 카테고리  |
| Random              | 랜덤      |
| Comments            | 댓글      |
| Advertisement Space | 광고 영역 |

## Ad slots

- `feed-*` — 메인 피드 카드 사이
- `category-*` — 카테고리 목록
- `popular-mid` — 인기 목록
- `story-before-comments-mobile` — 상세 모바일
- `story-sidebar-ad` — 상세 데스크탑
- `legal-top`, `legal-bottom`

## 반응형

- 모바일: 하단 네비
- `lg+`: 좌측 사이드바, 상세는 채팅+댓글 2컬럼
