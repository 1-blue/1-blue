-- app_sseoltalk: 썰톡 AI 카톡형 썰 커뮤니티

CREATE SCHEMA IF NOT EXISTS app_sseoltalk;
GRANT USAGE ON SCHEMA app_sseoltalk TO anon, authenticated, service_role;

CREATE TABLE app_sseoltalk.stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  counterpart_name TEXT,
  published_at DATE,
  view_count INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT false,
  quality_score INTEGER,
  quality_issues JSONB,
  generation_model TEXT,
  validation_model TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE app_sseoltalk.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID NOT NULL REFERENCES app_sseoltalk.stories(id) ON DELETE CASCADE,
  sender TEXT NOT NULL,
  is_me BOOLEAN NOT NULL DEFAULT false,
  content TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  UNIQUE (story_id, order_index)
);

CREATE TABLE app_sseoltalk.reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID NOT NULL REFERENCES app_sseoltalk.stories(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (story_id, session_id, type)
);

CREATE TABLE app_sseoltalk.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID NOT NULL REFERENCES app_sseoltalk.stories(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES app_sseoltalk.comments(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  nickname TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  content TEXT NOT NULL,
  like_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE app_sseoltalk.comment_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID NOT NULL REFERENCES app_sseoltalk.comments(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (comment_id, session_id)
);

CREATE TABLE app_sseoltalk.story_views (
  story_id UUID NOT NULL REFERENCES app_sseoltalk.stories(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (story_id, session_id)
);

CREATE INDEX idx_sseoltalk_stories_published ON app_sseoltalk.stories (is_published, published_at DESC, created_at DESC);
CREATE INDEX idx_sseoltalk_stories_category ON app_sseoltalk.stories (category, is_published, published_at DESC);
CREATE INDEX idx_sseoltalk_messages_story ON app_sseoltalk.messages (story_id, order_index);
CREATE INDEX idx_sseoltalk_reactions_story ON app_sseoltalk.reactions (story_id);
CREATE INDEX idx_sseoltalk_comments_story ON app_sseoltalk.comments (story_id, parent_comment_id, created_at);
CREATE INDEX idx_sseoltalk_comment_likes_comment ON app_sseoltalk.comment_likes (comment_id);

GRANT ALL ON ALL TABLES IN SCHEMA app_sseoltalk TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA app_sseoltalk TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA app_sseoltalk
  GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA app_sseoltalk
  GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
