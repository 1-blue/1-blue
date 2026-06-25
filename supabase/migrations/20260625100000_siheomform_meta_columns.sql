-- app_siheomform: Stitch 메타 필드 보완

ALTER TABLE app_siheomform.cbts
  ADD COLUMN IF NOT EXISTS cover_image_url TEXT,
  ADD COLUMN IF NOT EXISTS passing_score INTEGER NOT NULL DEFAULT 60,
  ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT false;
