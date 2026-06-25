-- 시험폼: 배점, 댓글, 좋아요

ALTER TABLE app_siheomform.cbts
  ADD COLUMN IF NOT EXISTS total_points INTEGER NOT NULL DEFAULT 100;

ALTER TABLE app_siheomform.questions
  ADD COLUMN IF NOT EXISTS points INTEGER;

CREATE TABLE IF NOT EXISTS app_siheomform.cbt_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cbt_id UUID NOT NULL REFERENCES app_siheomform.cbts(id) ON DELETE CASCADE,
  attempt_id UUID NOT NULL UNIQUE REFERENCES app_siheomform.attempts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_siheomform_comments_cbt ON app_siheomform.cbt_comments(cbt_id);

CREATE TABLE IF NOT EXISTS app_siheomform.cbt_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cbt_id UUID NOT NULL REFERENCES app_siheomform.cbts(id) ON DELETE CASCADE,
  attempt_id UUID NOT NULL UNIQUE REFERENCES app_siheomform.attempts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_siheomform_cbt_likes_cbt ON app_siheomform.cbt_likes(cbt_id);

CREATE TABLE IF NOT EXISTS app_siheomform.comment_likes (
  comment_id UUID NOT NULL REFERENCES app_siheomform.cbt_comments(id) ON DELETE CASCADE,
  attempt_id UUID NOT NULL REFERENCES app_siheomform.attempts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (comment_id, attempt_id)
);

GRANT ALL ON app_siheomform.cbt_comments TO anon, authenticated, service_role;
GRANT ALL ON app_siheomform.cbt_likes TO anon, authenticated, service_role;
GRANT ALL ON app_siheomform.comment_likes TO anon, authenticated, service_role;
