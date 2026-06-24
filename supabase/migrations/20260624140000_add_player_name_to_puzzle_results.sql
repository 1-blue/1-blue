ALTER TABLE app_daily_deduction.puzzle_results
  ADD COLUMN IF NOT EXISTS player_name TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS player_label TEXT NOT NULL DEFAULT '';
