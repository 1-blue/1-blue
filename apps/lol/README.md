# LOL 퀴즈 앱

리그 오브 레전드 챔피언 스킨을 맞추는 퀴즈 애플리케이션입니다.

## 기능

- 챔피언 스킨 이미지를 보고 이름 맞추기
- 객관식과 주관식 모드 지원
- 점수와 소요시간 기반 랭킹 시스템
- 모드별 랭킹 확인

## 개발 환경 설정

1. 의존성 설치
```bash
npm install
```

2. 개발 서버 실행
```bash
npm run dev
```

## 데이터베이스 스키마

### 마이그레이션 적용하기

프로젝트에 새로 추가된 마이그레이션을 적용하려면:

1. Supabase 프로젝트에서 SQL 에디터 열기
2. `apps/lol/src/app/api/migrations` 폴더의 마이그레이션 파일 내용을 복사
3. SQL 에디터에 붙여넣고 실행

### 주요 테이블

1. `lol.champions` - 챔피언 정보
2. `lol.champion_skins` - 챔피언 스킨 정보
3. `lol.rankings` - 퀴즈 랭킹 정보

## 랭킹 시스템

랭킹 시스템은 다음 규칙으로 작동합니다:

1. 퀴즈를 완료한 후 닉네임과 비밀번호를 입력하여 랭킹 등록
2. 점수가 높은 순으로 랭킹 정렬
3. 점수가 같을 경우 소요 시간이 짧은 순으로 정렬
4. 객관식과 주관식 모드 각각의 랭킹 별도 관리

## License

MIT

## 모든 버전
https://ddragon.leagueoflegends.com/api/versions.json

## 모든 챔피언 정보
https://ddragon.leagueoflegends.com/cdn/15.8.1/data/ko_KR/champion.json

## 특정 챔피언 정보
https://ddragon.leagueoflegends.com/cdn/15.8.1/data/ko_KR/champion/Aatrox.json

## 챔피언(스킨) 이미지
https://ddragon.leagueoflegends.com/cdn/img/champion/loading/MissFortune_0.jpg

## 챔피언 스킬 이미지
> https://ddragon.leagueoflegends.com/cdn/15.8.1/data/ko_KR/champion/Aatrox.json

1. https://ddragon.leagueoflegends.com/cdn/15.8.1/img/passive/Aatrox_Passive.png
2. https://ddragon.leagueoflegends.com/cdn/15.8.1/img/spell/AatroxQ.png
3. https://ddragon.leagueoflegends.com/cdn/15.8.1/img/spell/AatroxW.png
4. https://ddragon.leagueoflegends.com/cdn/15.8.1/img/spell/AatroxE.png
5. https://ddragon.leagueoflegends.com/cdn/15.8.1/img/spell/AatroxR.png

## 스펠 이미지
> https://ddragon.leagueoflegends.com/cdn/15.8.1/data/ko_KR/summoner.json

1. https://ddragon.leagueoflegends.com/cdn/15.8.1/img/spell/SummonerFlash.png
2. https://ddragon.leagueoflegends.com/cdn/15.8.1/img/spell/SummonerHeal.png
3. https://ddragon.leagueoflegends.com/cdn/15.8.1/img/spell/SummonerTeleport.png
4. https://ddragon.leagueoflegends.com/cdn/15.8.1/img/spell/SummonerSmite.png
5. https://ddragon.leagueoflegends.com/cdn/15.8.1/img/spell/SummonerExhaust.png
6. https://ddragon.leagueoflegends.com/cdn/15.8.1/img/spell/SummonerMana.png
7. https://ddragon.leagueoflegends.com/cdn/15.8.1/img/spell/SummonerBoost.png
8. https://ddragon.leagueoflegends.com/cdn/15.8.1/img/spell/SummonerBarrier.png
9. https://ddragon.leagueoflegends.com/cdn/15.8.1/img/spell/SummonerPoroRecall.png
10. https://ddragon.leagueoflegends.com/cdn/15.8.1/img/spell/SummonerPoroThrow.png
11. https://ddragon.leagueoflegends.com/cdn/15.8.1/img/spell/SummonerSnowball.png
12. https://ddragon.leagueoflegends.com/cdn/15.8.1/img/spell/SummonerSnowball.png
