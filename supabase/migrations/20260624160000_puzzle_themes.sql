-- Migrate puzzle set_type from A/B to theme IDs (mystery, alibi, theft)

ALTER TABLE app_daily_deduction.puzzle_sets
  DROP CONSTRAINT IF EXISTS puzzle_sets_set_type_check;

UPDATE app_daily_deduction.puzzle_sets SET set_type = 'mystery' WHERE set_type = 'A';
UPDATE app_daily_deduction.puzzle_sets SET set_type = 'alibi' WHERE set_type = 'B';

ALTER TABLE app_daily_deduction.puzzle_sets
  ADD CONSTRAINT puzzle_sets_set_type_check
  CHECK (set_type IN ('mystery', 'alibi', 'theft'));
