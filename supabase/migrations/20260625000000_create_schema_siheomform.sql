-- app_siheomform: CBT 시험폼 스키마 (Phase 1 선행 세팅)

CREATE SCHEMA IF NOT EXISTS app_siheomform;
GRANT USAGE ON SCHEMA app_siheomform TO anon, authenticated, service_role;

CREATE TABLE app_siheomform.cbts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  admin_token TEXT NOT NULL UNIQUE,
  public_id TEXT NOT NULL UNIQUE,
  time_limit_minutes INTEGER,
  shuffle_questions BOOLEAN NOT NULL DEFAULT false,
  shuffle_choices BOOLEAN NOT NULL DEFAULT false,
  show_explanation BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE app_siheomform.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cbt_id UUID NOT NULL REFERENCES app_siheomform.cbts(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  correct_choice_id UUID,
  explanation TEXT,
  explanation_image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (cbt_id, order_index)
);

CREATE TABLE app_siheomform.choices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES app_siheomform.questions(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (question_id, order_index)
);

ALTER TABLE app_siheomform.questions
  ADD CONSTRAINT questions_correct_choice_fk
  FOREIGN KEY (correct_choice_id) REFERENCES app_siheomform.choices(id) ON DELETE SET NULL;

CREATE TABLE app_siheomform.attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cbt_id UUID NOT NULL REFERENCES app_siheomform.cbts(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL,
  score INTEGER,
  total_questions INTEGER,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE app_siheomform.answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES app_siheomform.attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES app_siheomform.questions(id) ON DELETE CASCADE,
  selected_choice_id UUID REFERENCES app_siheomform.choices(id) ON DELETE SET NULL,
  is_correct BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (attempt_id, question_id)
);

CREATE INDEX idx_siheomform_questions_cbt_id ON app_siheomform.questions(cbt_id);
CREATE INDEX idx_siheomform_choices_question_id ON app_siheomform.choices(question_id);
CREATE INDEX idx_siheomform_attempts_cbt_id ON app_siheomform.attempts(cbt_id);
CREATE INDEX idx_siheomform_answers_attempt_id ON app_siheomform.answers(attempt_id);

GRANT ALL ON ALL TABLES IN SCHEMA app_siheomform TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA app_siheomform TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA app_siheomform
  GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA app_siheomform
  GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
