-- Schema-per-app migration template
-- Replace siheomform with app slug (e.g. app_geo_finder)

CREATE SCHEMA IF NOT EXISTS app_siheomform;

GRANT USAGE ON SCHEMA app_siheomform TO anon, authenticated, service_role;

-- Example table
CREATE TABLE IF NOT EXISTS app_siheomform.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE app_siheomform.notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON app_siheomform.notes
  FOR SELECT TO anon, authenticated
  USING (true);

GRANT SELECT ON app_siheomform.notes TO anon, authenticated;
GRANT ALL ON app_siheomform.notes TO service_role;
