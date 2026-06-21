-- Schema-per-app migration template
-- Replace {SCHEMA} with app slug (e.g. app_geo_finder)

CREATE SCHEMA IF NOT EXISTS app_{SCHEMA};

GRANT USAGE ON SCHEMA app_{SCHEMA} TO anon, authenticated, service_role;

-- Example table
CREATE TABLE IF NOT EXISTS app_{SCHEMA}.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE app_{SCHEMA}.notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON app_{SCHEMA}.notes
  FOR SELECT TO anon, authenticated
  USING (true);

GRANT SELECT ON app_{SCHEMA}.notes TO anon, authenticated;
GRANT ALL ON app_{SCHEMA}.notes TO service_role;
