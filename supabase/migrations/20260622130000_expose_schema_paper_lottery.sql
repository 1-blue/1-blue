-- Expose app_paper_lottery schema to PostgREST (required for Supabase JS client)

ALTER ROLE authenticator SET pgrst.db_schemas = 'public, app_paper_lottery';

GRANT USAGE ON SCHEMA app_paper_lottery TO authenticator;
GRANT ALL ON ALL TABLES IN SCHEMA app_paper_lottery TO authenticator;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA app_paper_lottery TO authenticator;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA app_paper_lottery TO authenticator;

NOTIFY pgrst, 'reload config';
NOTIFY pgrst, 'reload schema';
