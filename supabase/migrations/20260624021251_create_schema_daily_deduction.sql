-- Daily deduction schema (app_daily_deduction)

CREATE SCHEMA IF NOT EXISTS app_daily_deduction;

GRANT USAGE ON SCHEMA app_daily_deduction TO service_role, authenticator;

CREATE TABLE app_daily_deduction.puzzle_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  puzzle_date DATE NOT NULL UNIQUE,
  set_type TEXT NOT NULL CHECK (set_type IN ('A', 'B')),
  title TEXT NOT NULL,
  premise TEXT NOT NULL,
  memory_minutes INTEGER NOT NULL DEFAULT 3 CHECK (memory_minutes >= 1 AND memory_minutes <= 10),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_puzzle_sets_date ON app_daily_deduction.puzzle_sets (puzzle_date DESC);

CREATE TABLE app_daily_deduction.clues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  puzzle_set_id UUID NOT NULL REFERENCES app_daily_deduction.puzzle_sets (id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL CHECK (order_index >= 0),
  text TEXT NOT NULL,
  is_fake BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE (puzzle_set_id, order_index)
);

CREATE INDEX idx_clues_puzzle_set ON app_daily_deduction.clues (puzzle_set_id, order_index);

CREATE TABLE app_daily_deduction.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  puzzle_set_id UUID NOT NULL REFERENCES app_daily_deduction.puzzle_sets (id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL CHECK (order_index >= 0),
  prompt TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_option_index INTEGER NOT NULL CHECK (correct_option_index >= 0 AND correct_option_index <= 3),
  explanation TEXT NOT NULL,
  UNIQUE (puzzle_set_id, order_index)
);

CREATE INDEX idx_questions_puzzle_set ON app_daily_deduction.questions (puzzle_set_id, order_index);

CREATE TABLE app_daily_deduction.puzzle_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  puzzle_set_id UUID NOT NULL REFERENCES app_daily_deduction.puzzle_sets (id) ON DELETE CASCADE,
  session_id UUID NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('memory', 'open')),
  wrong_count INTEGER NOT NULL DEFAULT 0 CHECK (wrong_count >= 0),
  time_seconds INTEGER NOT NULL DEFAULT 0 CHECK (time_seconds >= 0),
  answers JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (puzzle_set_id, session_id)
);

CREATE INDEX idx_puzzle_results_set_rank ON app_daily_deduction.puzzle_results (puzzle_set_id, wrong_count, time_seconds);

ALTER TABLE app_daily_deduction.puzzle_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_daily_deduction.clues ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_daily_deduction.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_daily_deduction.puzzle_results ENABLE ROW LEVEL SECURITY;

GRANT ALL ON ALL TABLES IN SCHEMA app_daily_deduction TO service_role, authenticator;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA app_daily_deduction TO service_role, authenticator;
