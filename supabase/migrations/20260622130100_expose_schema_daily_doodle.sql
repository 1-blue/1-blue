-- Expose app_daily_doodle schema to PostgREST (required for Supabase JS client)

ALTER ROLE authenticator SET pgrst.db_schemas = 'public, app_paper_lottery, app_daily_doodle';

GRANT USAGE ON SCHEMA app_daily_doodle TO authenticator;
GRANT ALL ON ALL TABLES IN SCHEMA app_daily_doodle TO authenticator;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA app_daily_doodle TO authenticator;

NOTIFY pgrst, 'reload config';
NOTIFY pgrst, 'reload schema';
