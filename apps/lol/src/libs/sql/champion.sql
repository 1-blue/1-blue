DROP TABLE IF EXISTS lol.champions;

CREATE TABLE lol.champions (
  id text not null,
  key text not null,
  name text not null,
  title text not null,
  splash_image_url text not null,
  loading_image_url text not null,
  square_image_url text not null,
  tags text[] not null,
  version text not null,
  created_at timestamp with time zone null default now(),
  constraint champions_pkey primary key (id)
) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS champions_name_idx ON lol.champions USING btree (name) TABLESPACE pg_default;

-- 테이블에 주석 추가
COMMENT ON TABLE lol.champions IS '리그 오브 레전드 챔피언 기본 정보를 저장하는 테이블';

-- 컬럼에 주석 추가
COMMENT ON COLUMN lol.champions.id IS '챔피언의 고유 ID (예: "Aatrox")';
COMMENT ON COLUMN lol.champions.key IS '챔피언의 숫자 키 (예: "266")';
COMMENT ON COLUMN lol.champions.name IS '챔피언 이름 (예: "아트록스")';
COMMENT ON COLUMN lol.champions.title IS '챔피언의 부제목/타이틀 (예: "다르킨의 검")';
COMMENT ON COLUMN lol.champions.splash_image_url IS '챔피언 스플래시 아트 이미지 URL';
COMMENT ON COLUMN lol.champions.loading_image_url IS '챔피언 로딩 화면 이미지 URL';
COMMENT ON COLUMN lol.champions.square_image_url IS '챔피언 아이콘 이미지 URL';
COMMENT ON COLUMN lol.champions.tags IS '챔피언 역할 태그 배열 (예: {"Fighter", "Tank"})';
COMMENT ON COLUMN lol.champions.version IS '데이터 버전 (예: "15.8.1")';
COMMENT ON COLUMN lol.champions.created_at IS '레코드 생성 시간';