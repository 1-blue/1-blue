-- Expose app_siheomform schema to PostgREST

ALTER ROLE authenticator SET pgrst.db_schemas = 'public, app_paper_lottery, app_daily_doodle, app_daily_deduction, app_siheomform';

GRANT USAGE ON SCHEMA app_siheomform TO authenticator;
GRANT ALL ON ALL TABLES IN SCHEMA app_siheomform TO authenticator;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA app_siheomform TO authenticator;

NOTIFY pgrst, 'reload config';
NOTIFY pgrst, 'reload schema';
