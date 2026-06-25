-- app_siheomform ONLY — do not truncate other schemas (public, app_paper_lottery, etc.)
TRUNCATE TABLE
  app_siheomform.comment_likes,
  app_siheomform.cbt_likes,
  app_siheomform.cbt_comments,
  app_siheomform.answers,
  app_siheomform.attempts,
  app_siheomform.choices,
  app_siheomform.questions,
  app_siheomform.cbts
RESTART IDENTITY CASCADE;
