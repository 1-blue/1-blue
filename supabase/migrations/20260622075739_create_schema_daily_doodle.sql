-- Schema-per-app migration template
-- Replace daily_doodle with app slug (e.g. app_geo_finder)

CREATE SCHEMA IF NOT EXISTS app_daily_doodle;

GRANT USAGE ON SCHEMA app_daily_doodle TO anon, authenticated, service_role;

-- Example table
CREATE TABLE IF NOT EXISTS app_daily_doodle.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE app_daily_doodle.notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON app_daily_doodle.notes
  FOR SELECT TO anon, authenticated
  USING (true);

GRANT SELECT ON app_daily_doodle.notes TO anon, authenticated;
GRANT ALL ON app_daily_doodle.notes TO service_role;
