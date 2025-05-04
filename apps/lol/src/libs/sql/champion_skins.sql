DROP TABLE IF EXISTS lol.champion_skins;

CREATE TABLE lol.champion_skins (
  id serial not null,
  champion_id text not null,
  champion_name text not null,
  skin_id text not null,
  skin_num integer not null,
  skin_name text not null,
  splash_image_url text not null,
  loading_image_url text not null,
  square_image_url text not null,
  has_chromas boolean not null default false,
  version text not null,
  created_at timestamp with time zone null default now(),
  constraint champion_skins_pkey primary key (id),
  constraint unique_champion_skin unique (champion_id, skin_id)
);

CREATE INDEX champion_skins_champion_id_idx ON lol.champion_skins USING btree (champion_id);
CREATE INDEX champion_skins_skin_id_idx ON lol.champion_skins USING btree (skin_id);

-- 테이블에 주석 추가
COMMENT ON TABLE lol.champion_skins IS '리그 오브 레전드 챔피언 스킨 정보를 저장하는 테이블';

-- 컬럼에 주석 추가
COMMENT ON COLUMN lol.champion_skins.id IS '스킨 레코드의 고유 식별자(자동 증가)';
COMMENT ON COLUMN lol.champion_skins.champion_id IS '챔피언의 고유 ID (예: "Aatrox")';
COMMENT ON COLUMN lol.champion_skins.champion_name IS '챔피언 이름 (예: "아트록스")';
COMMENT ON COLUMN lol.champion_skins.skin_id IS '스킨의 고유 ID (예: "266001")';
COMMENT ON COLUMN lol.champion_skins.skin_num IS '스킨 번호 (0: 기본 스킨, 1~: 추가 스킨)';
COMMENT ON COLUMN lol.champion_skins.skin_name IS '스킨 이름 (예: "정의의 아트록스")';
COMMENT ON COLUMN lol.champion_skins.splash_image_url IS '스킨 스플래시 아트 이미지 URL';
COMMENT ON COLUMN lol.champion_skins.loading_image_url IS '스킨 로딩 화면 이미지 URL';
COMMENT ON COLUMN lol.champion_skins.square_image_url IS '스킨 아이콘 이미지 URL';
COMMENT ON COLUMN lol.champion_skins.has_chromas IS '크로마 스킨 보유 여부';
COMMENT ON COLUMN lol.champion_skins.version IS '데이터 버전 (예: "15.8.1")';
COMMENT ON COLUMN lol.champion_skins.created_at IS '레코드 생성 시간';