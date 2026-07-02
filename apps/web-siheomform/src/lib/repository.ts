import type { CbtDraft } from "@/core";
import {
  fromDbRows,
  generateAdminToken,
  generatePublicId,
  resolveDisplayNickname,
  resolveQuestionPointsMap,
  toDbPayload,
  type DbCbtRow,
  type DbChoiceRow,
  type DbQuestionRow,
} from "@/core";
import { getDb } from "@/lib/db";

export type CbtSummary = {
  publicId: string;
  title: string;
  description: string | null;
  coverImageUrl: string | null;
  questionCount: number;
  timeLimitMinutes: number | null;
  passingScore: number;
  attemptCount: number;
  averageScore: number | null;
  likeCount: number;
  updatedAt: string;
};

export type ManageCbtView = CbtDraft & {
  id: string;
  adminToken: string;
  publicId: string;
  stats: {
    attemptCount: number;
    averageScore: number | null;
  };
};

const fetchCbtByAdminToken = async (adminToken: string) => {
  const db = getDb();
  const { data: cbt, error } = await db
    .from("cbts")
    .select("*")
    .eq("admin_token", adminToken)
    .single();
  if (error || !cbt) {
    throw new Error("cbt_not_found");
  }
  return cbt as DbCbtRow;
};

const fetchCbtByPublicId = async (publicId: string) => {
  const db = getDb();
  const { data: cbt, error } = await db.from("cbts").select("*").eq("public_id", publicId).single();
  if (error || !cbt) {
    throw new Error("cbt_not_found");
  }
  return cbt as DbCbtRow;
};

const fetchQuestionsAndChoices = async (cbtId: string) => {
  const db = getDb();
  const { data: questions, error: qError } = await db
    .from("questions")
    .select("*")
    .eq("cbt_id", cbtId)
    .order("order_index");

  if (qError || !questions) {
    throw new Error("questions_not_found");
  }

  const questionIds = questions.map((q) => q.id);
  if (questionIds.length === 0) {
    return {
      questions: questions as DbQuestionRow[],
      choices: [] as DbChoiceRow[],
    };
  }

  const { data: choices, error: cError } = await db
    .from("choices")
    .select("*")
    .in("question_id", questionIds)
    .order("order_index");

  if (cError || !choices) {
    throw new Error("choices_not_found");
  }

  return {
    questions: questions as DbQuestionRow[],
    choices: choices as DbChoiceRow[],
  };
};

type QuestionBatchItem = ReturnType<typeof toDbPayload>["questions"][number];

const persistQuestionBatch = async (
  db: ReturnType<typeof getDb>,
  cbtId: string,
  items: QuestionBatchItem[],
) => {
  for (const item of items) {
    const { error: qError } = await db.from("questions").insert({
      id: item.question.id,
      cbt_id: cbtId,
      order_index: item.question.order_index,
      content: item.question.content,
      image_url: item.question.image_url,
      correct_choice_id: null,
      explanation: item.question.explanation,
      explanation_image_url: item.question.explanation_image_url,
      points: item.question.points,
    });

    if (qError) {
      throw new Error(qError.message);
    }

    const { error: cError } = await db.from("choices").insert(
      item.choices.map((choice) => ({
        id: choice.id,
        question_id: item.question.id,
        order_index: choice.order_index,
        content: choice.content,
        image_url: choice.image_url,
      })),
    );

    if (cError) {
      throw new Error(cError.message);
    }

    if (item.question.correct_choice_id) {
      const { error: uError } = await db
        .from("questions")
        .update({ correct_choice_id: item.question.correct_choice_id })
        .eq("id", item.question.id);

      if (uError) {
        throw new Error(uError.message);
      }
    }
  }
};

export const createCbt = async (
  draft: CbtDraft,
  options?: { adminToken?: string; publicId?: string },
) => {
  const db = getDb();
  const adminToken = options?.adminToken ?? generateAdminToken();
  const publicId = options?.publicId ?? generatePublicId();
  const payload = toDbPayload(draft, { adminToken, publicId });

  const { data: cbt, error: cbtError } = await db
    .from("cbts")
    .insert({
      title: payload.cbt.title,
      description: payload.cbt.description,
      cover_image_url: payload.cbt.cover_image_url,
      admin_token: payload.cbt.admin_token,
      public_id: payload.cbt.public_id,
      time_limit_minutes: payload.cbt.time_limit_minutes,
      shuffle_questions: payload.cbt.shuffle_questions,
      shuffle_choices: payload.cbt.shuffle_choices,
      show_explanation: payload.cbt.show_explanation,
      passing_score: payload.cbt.passing_score,
      is_public: payload.cbt.is_public,
      total_points: payload.cbt.total_points,
    })
    .select("*")
    .single();

  if (cbtError || !cbt) {
    throw new Error(cbtError?.message ?? "cbt_create_failed");
  }

  try {
    await persistQuestionBatch(db, cbt.id, payload.questions);
  } catch (error) {
    await db.from("cbts").delete().eq("id", cbt.id);
    throw error;
  }

  return {
    id: cbt.id,
    adminToken,
    publicId,
    title: cbt.title,
    questionCount: payload.questions.length,
  };
};

export const getManageCbt = async (adminToken: string): Promise<ManageCbtView> => {
  const cbt = await fetchCbtByAdminToken(adminToken);
  const { questions, choices } = await fetchQuestionsAndChoices(cbt.id);
  const draft = fromDbRows(cbt, questions, choices);

  const db = getDb();
  const { data: attempts } = await db
    .from("attempts")
    .select("score, submitted_at")
    .eq("cbt_id", cbt.id);
  const submitted = (attempts ?? []).filter((a) => a.submitted_at);
  const attemptCount = submitted.length;
  const scored = submitted.filter((a) => typeof a.score === "number");
  const averageScore =
    scored.length > 0
      ? Math.round(scored.reduce((sum, a) => sum + (a.score ?? 0), 0) / scored.length)
      : null;

  return {
    ...draft,
    id: cbt.id,
    adminToken: cbt.admin_token,
    publicId: cbt.public_id,
    stats: { attemptCount, averageScore },
  };
};

export const updateCbt = async (adminToken: string, draft: CbtDraft) => {
  const cbt = await fetchCbtByAdminToken(adminToken);
  const payload = toDbPayload(draft, {
    adminToken: cbt.admin_token,
    publicId: cbt.public_id,
    cbtId: cbt.id,
  });

  const db = getDb();
  const { error: updateError } = await db
    .from("cbts")
    .update({
      title: payload.cbt.title,
      description: payload.cbt.description,
      cover_image_url: payload.cbt.cover_image_url,
      time_limit_minutes: payload.cbt.time_limit_minutes,
      shuffle_questions: payload.cbt.shuffle_questions,
      shuffle_choices: payload.cbt.shuffle_choices,
      show_explanation: payload.cbt.show_explanation,
      passing_score: payload.cbt.passing_score,
      is_public: payload.cbt.is_public,
      total_points: payload.cbt.total_points,
      updated_at: new Date().toISOString(),
    })
    .eq("id", cbt.id);

  if (updateError) {
    throw new Error(updateError.message);
  }

  await db
    .from("choices")
    .delete()
    .in(
      "question_id",
      (await db.from("questions").select("id").eq("cbt_id", cbt.id)).data?.map((q) => q.id) ?? [],
    );
  await db.from("questions").delete().eq("cbt_id", cbt.id);

  await persistQuestionBatch(db, cbt.id, payload.questions);

  return { publicId: cbt.public_id, questionCount: payload.questions.length };
};

export const deleteCbt = async (adminToken: string) => {
  const cbt = await fetchCbtByAdminToken(adminToken);
  const db = getDb();
  const { error } = await db.from("cbts").delete().eq("id", cbt.id);
  if (error) {
    throw new Error(error.message);
  }
};

export const getPublicCbt = async (publicId: string) => {
  const cbt = await fetchCbtByPublicId(publicId);
  const { questions, choices } = await fetchQuestionsAndChoices(cbt.id);
  const draft = fromDbRows(cbt, questions, choices);

  return {
    id: cbt.id,
    publicId: cbt.public_id,
    metadata: draft.metadata,
    questions: draft.questions.map((q) => ({
      id: q.id,
      orderIndex: q.orderIndex,
      content: q.content,
      imageUrl: q.imageUrl,
      choices: q.choices.map((c) => ({
        id: c.id,
        orderIndex: c.orderIndex,
        content: c.content,
        imageUrl: c.imageUrl,
      })),
    })),
    answers: draft.questions.map((q) => ({
      questionId: q.id,
      correctChoiceId: q.correctChoiceId,
      explanation: q.explanation,
      explanationImageUrl: q.explanationImageUrl,
    })),
  };
};

export const listPublicCbts = async (
  sort: "popular" | "recent" | "likes" = "recent",
): Promise<CbtSummary[]> => {
  const db = getDb();
  const { data: cbts, error } = await db
    .from("cbts")
    .select(
      "id, public_id, title, description, cover_image_url, time_limit_minutes, passing_score, updated_at",
    )
    .eq("is_public", true);

  if (error || !cbts?.length) {
    return [];
  }

  const cbtIds = cbts.map((cbt) => cbt.id);

  const [questionsRes, attemptsRes, likesRes] = await Promise.all([
    db.from("questions").select("cbt_id").in("cbt_id", cbtIds),
    db.from("attempts").select("cbt_id, score, submitted_at").in("cbt_id", cbtIds),
    db.from("cbt_likes").select("cbt_id").in("cbt_id", cbtIds),
  ]);

  const questionCountByCbtId = new Map<string, number>();
  for (const row of questionsRes.data ?? []) {
    questionCountByCbtId.set(row.cbt_id, (questionCountByCbtId.get(row.cbt_id) ?? 0) + 1);
  }

  const attemptStatsByCbtId = new Map<
    string,
    { count: number; scoreSum: number; scoredCount: number }
  >();
  for (const row of attemptsRes.data ?? []) {
    if (!row.submitted_at) {
      continue;
    }
    const stats = attemptStatsByCbtId.get(row.cbt_id) ?? { count: 0, scoreSum: 0, scoredCount: 0 };
    stats.count += 1;
    if (typeof row.score === "number") {
      stats.scoreSum += row.score;
      stats.scoredCount += 1;
    }
    attemptStatsByCbtId.set(row.cbt_id, stats);
  }

  const likeCountByCbtId = new Map<string, number>();
  for (const row of likesRes.data ?? []) {
    likeCountByCbtId.set(row.cbt_id, (likeCountByCbtId.get(row.cbt_id) ?? 0) + 1);
  }

  const summaries: CbtSummary[] = cbts.map((cbt) => {
    const attemptStats = attemptStatsByCbtId.get(cbt.id);
    const attemptCount = attemptStats?.count ?? 0;
    const scoredCount = attemptStats?.scoredCount ?? 0;
    const averageScore =
      scoredCount > 0 && attemptStats ? Math.round(attemptStats.scoreSum / scoredCount) : null;

    return {
      publicId: cbt.public_id,
      title: cbt.title,
      description: cbt.description,
      coverImageUrl: cbt.cover_image_url,
      questionCount: questionCountByCbtId.get(cbt.id) ?? 0,
      timeLimitMinutes: cbt.time_limit_minutes,
      passingScore: cbt.passing_score,
      attemptCount,
      averageScore,
      likeCount: likeCountByCbtId.get(cbt.id) ?? 0,
      updatedAt: cbt.updated_at,
    };
  });

  if (sort === "popular") {
    summaries.sort(
      (a, b) => b.attemptCount - a.attemptCount || b.updatedAt.localeCompare(a.updatedAt),
    );
  } else if (sort === "likes") {
    summaries.sort((a, b) => b.likeCount - a.likeCount || b.updatedAt.localeCompare(a.updatedAt));
  } else {
    summaries.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  return summaries;
};

const assertSubmittedAttempt = async (
  db: ReturnType<typeof getDb>,
  cbtId: string,
  attemptId: string,
) => {
  const { data: attempt, error } = await db
    .from("attempts")
    .select("*")
    .eq("id", attemptId)
    .eq("cbt_id", cbtId)
    .single();

  if (error || !attempt || !attempt.submitted_at) {
    throw new Error("attempt_not_submitted");
  }

  return attempt;
};

export const createAttempt = async (publicId: string, nickname: string) => {
  const cbt = await fetchCbtByPublicId(publicId);
  const db = getDb();
  const { questions } = await fetchQuestionsAndChoices(cbt.id);

  const { data: existing } = await db.from("attempts").select("nickname").eq("cbt_id", cbt.id);
  const displayNickname = resolveDisplayNickname(
    nickname.trim(),
    (existing ?? []).map((a) => a.nickname),
  );

  const { data, error } = await db
    .from("attempts")
    .insert({
      cbt_id: cbt.id,
      nickname: displayNickname,
      total_questions: questions.length,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "attempt_create_failed");
  }

  return {
    attemptId: data.id,
    cbtId: cbt.id,
    totalQuestions: questions.length,
    displayNickname: data.nickname,
  };
};

export type SubmitAnswerInput = {
  questionId: string;
  selectedChoiceId: string | null;
};

export const submitAttempt = async (
  publicId: string,
  attemptId: string,
  answers: SubmitAnswerInput[],
) => {
  const cbt = await fetchCbtByPublicId(publicId);
  const db = getDb();

  const { data: existingAttempt, error: attemptError } = await db
    .from("attempts")
    .select("submitted_at")
    .eq("id", attemptId)
    .eq("cbt_id", cbt.id)
    .single();

  if (attemptError || !existingAttempt) {
    throw new Error("attempt_not_found");
  }
  if (existingAttempt.submitted_at) {
    throw new Error("attempt_already_submitted");
  }

  const { questions, choices } = await fetchQuestionsAndChoices(cbt.id);
  const draft = fromDbRows(cbt, questions, choices);
  const totalPoints = cbt.total_points ?? draft.metadata.totalPoints;
  const pointsMap = resolveQuestionPointsMap(
    questions.map((q) => ({ id: q.id, points: q.points })),
    totalPoints,
  );

  let earnedPoints = 0;
  const answerRows = answers.map((answer) => {
    const question = draft.questions.find((q) => q.id === answer.questionId);
    const isCorrect = question ? question.correctChoiceId === answer.selectedChoiceId : false;
    if (isCorrect) {
      earnedPoints += pointsMap.get(answer.questionId) ?? 0;
    }
    return {
      attempt_id: attemptId,
      question_id: answer.questionId,
      selected_choice_id: answer.selectedChoiceId,
      is_correct: isCorrect,
    };
  });

  await db.from("answers").insert(answerRows);

  const totalQuestions = draft.questions.length;
  const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
  const passed = score >= draft.metadata.passingScore;

  await db
    .from("attempts")
    .update({
      score,
      submitted_at: new Date().toISOString(),
    })
    .eq("id", attemptId);

  return {
    score,
    totalQuestions,
    correctCount: answerRows.filter((r) => r.is_correct).length,
    earnedPoints,
    totalPoints,
    passed,
    passingScore: draft.metadata.passingScore,
    showExplanation: draft.metadata.showExplanation,
    questions: draft.questions,
    answers: answerRows.map((row) => ({
      questionId: row.question_id,
      selectedChoiceId: row.selected_choice_id,
      isCorrect: row.is_correct,
    })),
  };
};

export const getAttemptResult = async (publicId: string, attemptId: string) => {
  const cbt = await fetchCbtByPublicId(publicId);
  const db = getDb();
  const { data: attempt, error } = await db
    .from("attempts")
    .select("*")
    .eq("id", attemptId)
    .eq("cbt_id", cbt.id)
    .single();

  if (error || !attempt) {
    throw new Error("attempt_not_found");
  }
  if (!attempt.submitted_at) {
    throw new Error("attempt_not_submitted");
  }

  const { questions, choices } = await fetchQuestionsAndChoices(cbt.id);
  const draft = fromDbRows(cbt, questions, choices);
  const { data: answerRows } = await db.from("answers").select("*").eq("attempt_id", attemptId);

  return {
    nickname: attempt.nickname,
    score: attempt.score ?? 0,
    totalQuestions: attempt.total_questions ?? draft.questions.length,
    passingScore: draft.metadata.passingScore,
    passed: (attempt.score ?? 0) >= draft.metadata.passingScore,
    showExplanation: draft.metadata.showExplanation,
    isPublic: cbt.is_public,
    title: draft.metadata.title,
    questions: draft.questions,
    answers: (answerRows ?? []).map((row) => ({
      questionId: row.question_id,
      selectedChoiceId: row.selected_choice_id,
      isCorrect: row.is_correct,
    })),
    submittedAt: attempt.submitted_at,
  };
};

export const getStats = async (adminToken: string) => {
  const cbt = await fetchCbtByAdminToken(adminToken);
  const db = getDb();
  const { questions } = await fetchQuestionsAndChoices(cbt.id);
  const { data: attempts } = await db
    .from("attempts")
    .select("*")
    .eq("cbt_id", cbt.id)
    .order("created_at", { ascending: false });

  const submitted = (attempts ?? []).filter((a) => a.submitted_at);
  const scores = submitted.map((a) => a.score ?? 0);
  const averageScore =
    scores.length > 0 ? Math.round(scores.reduce((s, v) => s + v, 0) / scores.length) : 0;
  const passRate =
    scores.length > 0
      ? Math.round((scores.filter((s) => s >= cbt.passing_score).length / scores.length) * 100)
      : 0;

  const { data: allAnswers } = await db
    .from("answers")
    .select("question_id, is_correct")
    .in(
      "attempt_id",
      submitted.map((a) => a.id),
    );

  const questionRates = questions.map((q) => {
    const related = (allAnswers ?? []).filter((a) => a.question_id === q.id);
    const correct = related.filter((a) => a.is_correct).length;
    const rate = related.length > 0 ? Math.round((correct / related.length) * 100) : 0;
    return { questionId: q.id, orderIndex: q.order_index, rate };
  });

  const buckets = [
    { label: "0-20", count: 0 },
    { label: "21-40", count: 0 },
    { label: "41-60", count: 0 },
    { label: "61-80", count: 0 },
    { label: "81-100", count: 0 },
  ];

  for (const score of scores) {
    if (score <= 20) buckets[0]!.count += 1;
    else if (score <= 40) buckets[1]!.count += 1;
    else if (score <= 60) buckets[2]!.count += 1;
    else if (score <= 80) buckets[3]!.count += 1;
    else buckets[4]!.count += 1;
  }

  return {
    title: cbt.title,
    passingScore: cbt.passing_score,
    attemptCount: submitted.length,
    averageScore,
    passRate,
    scoreBuckets: buckets,
    questionRates,
    attempts: submitted.map((a) => ({
      id: a.id,
      nickname: a.nickname,
      score: a.score ?? 0,
      submittedAt: a.submitted_at,
    })),
  };
};

export type CbtCommentView = {
  id: string;
  nickname: string;
  content: string;
  likeCount: number;
  likedByMe: boolean;
  isMine: boolean;
  createdAt: string;
};

export const getCbtLikeCount = async (publicId: string) => {
  const cbt = await fetchCbtByPublicId(publicId);
  const db = getDb();
  const { count } = await db
    .from("cbt_likes")
    .select("*", { count: "exact", head: true })
    .eq("cbt_id", cbt.id);
  return { likeCount: count ?? 0, cbtId: cbt.id, isPublic: cbt.is_public };
};

export const getCbtLikeStatus = async (publicId: string, attemptId?: string) => {
  const { likeCount, isPublic } = await getCbtLikeCount(publicId);
  if (!attemptId || !isPublic) {
    return { likeCount, likedByMe: false };
  }
  const cbt = await fetchCbtByPublicId(publicId);
  const db = getDb();
  const { data } = await db
    .from("cbt_likes")
    .select("id")
    .eq("cbt_id", cbt.id)
    .eq("attempt_id", attemptId)
    .maybeSingle();
  return { likeCount, likedByMe: Boolean(data) };
};

export const toggleCbtLike = async (publicId: string, attemptId: string) => {
  const cbt = await fetchCbtByPublicId(publicId);
  if (!cbt.is_public) {
    throw new Error("cbt_not_public");
  }
  const db = getDb();
  await assertSubmittedAttempt(db, cbt.id, attemptId);

  const { data: existing } = await db
    .from("cbt_likes")
    .select("id")
    .eq("cbt_id", cbt.id)
    .eq("attempt_id", attemptId)
    .maybeSingle();

  if (existing) {
    await db.from("cbt_likes").delete().eq("id", existing.id);
  } else {
    await db.from("cbt_likes").insert({ cbt_id: cbt.id, attempt_id: attemptId });
  }

  const { count } = await db
    .from("cbt_likes")
    .select("*", { count: "exact", head: true })
    .eq("cbt_id", cbt.id);

  return { liked: !existing, likeCount: count ?? 0 };
};

export const listCbtComments = async (publicId: string, attemptId?: string) => {
  const cbt = await fetchCbtByPublicId(publicId);
  if (!cbt.is_public) {
    return [];
  }
  const db = getDb();

  const { data: comments, error } = await db
    .from("cbt_comments")
    .select("id, content, created_at, attempt_id")
    .eq("cbt_id", cbt.id)
    .order("created_at", { ascending: false });

  if (error || !comments) {
    return [];
  }

  const attemptIds = comments.map((c) => c.attempt_id);
  const { data: attempts } =
    attemptIds.length > 0
      ? await db.from("attempts").select("id, nickname").in("id", attemptIds)
      : { data: [] };

  const nicknameMap = new Map((attempts ?? []).map((a) => [a.id, a.nickname]));

  const results: CbtCommentView[] = [];
  for (const comment of comments) {
    const { count } = await db
      .from("comment_likes")
      .select("*", { count: "exact", head: true })
      .eq("comment_id", comment.id);

    let likedByMe = false;
    if (attemptId) {
      const { data: myLike } = await db
        .from("comment_likes")
        .select("comment_id")
        .eq("comment_id", comment.id)
        .eq("attempt_id", attemptId)
        .maybeSingle();
      likedByMe = Boolean(myLike);
    }

    results.push({
      id: comment.id,
      nickname: nicknameMap.get(comment.attempt_id) ?? "익명",
      content: comment.content,
      likeCount: count ?? 0,
      likedByMe,
      isMine: attemptId === comment.attempt_id,
      createdAt: comment.created_at,
    });
  }

  return results;
};

export const createCbtComment = async (publicId: string, attemptId: string, content: string) => {
  const cbt = await fetchCbtByPublicId(publicId);
  if (!cbt.is_public) {
    throw new Error("cbt_not_public");
  }
  const trimmed = content.trim();
  if (trimmed.length < 1 || trimmed.length > 500) {
    throw new Error("invalid_content");
  }

  const db = getDb();
  await assertSubmittedAttempt(db, cbt.id, attemptId);

  const { data: existing } = await db
    .from("cbt_comments")
    .select("id")
    .eq("attempt_id", attemptId)
    .maybeSingle();

  if (existing) {
    throw new Error("comment_already_exists");
  }

  const { data, error } = await db
    .from("cbt_comments")
    .insert({ cbt_id: cbt.id, attempt_id: attemptId, content: trimmed })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "comment_create_failed");
  }

  const { data: attempt } = await db
    .from("attempts")
    .select("nickname")
    .eq("id", attemptId)
    .single();

  return {
    id: data.id,
    nickname: attempt?.nickname ?? "익명",
    content: data.content,
    likeCount: 0,
    likedByMe: false,
    isMine: true,
    createdAt: data.created_at,
  };
};

export const toggleCommentLike = async (publicId: string, commentId: string, attemptId: string) => {
  const cbt = await fetchCbtByPublicId(publicId);
  if (!cbt.is_public) {
    throw new Error("cbt_not_public");
  }
  const db = getDb();
  await assertSubmittedAttempt(db, cbt.id, attemptId);

  const { data: comment } = await db
    .from("cbt_comments")
    .select("id")
    .eq("id", commentId)
    .eq("cbt_id", cbt.id)
    .single();

  if (!comment) {
    throw new Error("comment_not_found");
  }

  const { data: existing } = await db
    .from("comment_likes")
    .select("comment_id")
    .eq("comment_id", commentId)
    .eq("attempt_id", attemptId)
    .maybeSingle();

  if (existing) {
    await db.from("comment_likes").delete().eq("comment_id", commentId).eq("attempt_id", attemptId);
  } else {
    await db.from("comment_likes").insert({ comment_id: commentId, attempt_id: attemptId });
  }

  const { count } = await db
    .from("comment_likes")
    .select("*", { count: "exact", head: true })
    .eq("comment_id", commentId);

  return { liked: !existing, likeCount: count ?? 0 };
};
