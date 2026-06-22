-- Daily doodle schema (app_daily_doodle)

CREATE SCHEMA IF NOT EXISTS app_daily_doodle;

GRANT USAGE ON SCHEMA app_daily_doodle TO service_role, authenticator;

CREATE TABLE app_daily_doodle.boards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_date DATE NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  stroke_count INTEGER NOT NULL DEFAULT 0 CHECK (stroke_count >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  closed_at TIMESTAMPTZ
);

CREATE INDEX idx_boards_board_date ON app_daily_doodle.boards (board_date);

CREATE TABLE app_daily_doodle.strokes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID NOT NULL REFERENCES app_daily_doodle.boards (id) ON DELETE CASCADE,
  session_id UUID NOT NULL,
  nickname TEXT NOT NULL,
  tool TEXT NOT NULL CHECK (tool IN ('pen', 'text')),
  color TEXT NOT NULL,
  width INTEGER,
  points JSONB,
  text_content TEXT,
  font_family TEXT,
  x DOUBLE PRECISION,
  y DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_strokes_board_created ON app_daily_doodle.strokes (board_id, created_at);
CREATE INDEX idx_strokes_board_session ON app_daily_doodle.strokes (board_id, session_id);
CREATE INDEX idx_strokes_session_created ON app_daily_doodle.strokes (session_id, created_at);

CREATE TABLE app_daily_doodle.snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_date DATE NOT NULL UNIQUE,
  strokes JSONB NOT NULL DEFAULT '[]'::jsonb,
  participant_count INTEGER NOT NULL DEFAULT 0,
  closed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_snapshots_board_date ON app_daily_doodle.snapshots (board_date DESC);

ALTER TABLE app_daily_doodle.boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_daily_doodle.strokes ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_daily_doodle.snapshots ENABLE ROW LEVEL SECURITY;

GRANT ALL ON ALL TABLES IN SCHEMA app_daily_doodle TO service_role, authenticator;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA app_daily_doodle TO service_role, authenticator;
