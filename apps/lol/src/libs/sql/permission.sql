-- 스키마에 대한 접근 권한 부여
GRANT USAGE ON SCHEMA lol TO postgres, anon, authenticated, service_role;

-- 테이블에 대한 모든 권한 부여
GRANT ALL ON ALL TABLES IN SCHEMA lol TO postgres, anon, authenticated, service_role;

-- 시퀀스에 대한 권한 부여
GRANT ALL ON ALL SEQUENCES IN SCHEMA lol TO postgres, anon, authenticated, service_role;

-- 미래에 생성될 테이블에 대한 기본 권한 설정
ALTER DEFAULT PRIVILEGES IN SCHEMA lol 
GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA lol 
GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;