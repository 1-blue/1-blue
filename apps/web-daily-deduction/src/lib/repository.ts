import {
  ensureLookahead,
  getKstPuzzleDate,
  gradeAnswers,
  runGeneratePipeline,
  submitPayloadSchema,
  todaySubmitPayloadSchema,
  type GeneratedPuzzle,
  type PuzzleMode,
  type PuzzleThemeId,
  type SubmitPayload,
} from "@1-blue/core/daily-deduction";
import { getDb } from "./db";
import type {
  ArchiveListItem,
  ArchivePuzzleView,
  GradedAnswer,
  RankingEntry,
  RankingView,
  SubmitResultView,
  TodayPuzzleView,
} from "./types";

type DbPuzzleSet = {
  id: string;
  puzzle_date: string;
  set_type: PuzzleThemeId;
  title: string;
  premise: string;
  memory_minutes: number;
};

type DbClue = {
  id: string;
  puzzle_set_id: string;
  order_index: number;
  text: string;
  is_fake: boolean;
};

type DbQuestion = {
  id: string;
  puzzle_set_id: string;
  order_index: number;
  prompt: string;
  options: string[];
  correct_option_index: number;
  explanation: string;
};

const getGeminiConfig = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
  if (!apiKey) {
    throw new Error("gemini_not_configured");
  }
  return { apiKey, model };
};

const normalizePlayerName = (displayName: string): string => {
  return displayName.trim().replace(/\s+/g, " ");
};

const assertArchiveDate = (puzzleDate: string): void => {
  const today = getKstPuzzleDate();
  if (puzzleDate >= today) {
    throw new Error("archive_not_available");
  }
};

const assignPlayerLabel = async (puzzleSetId: string, displayName: string): Promise<{
  playerName: string;
  playerLabel: string;
}> => {
  const playerName = normalizePlayerName(displayName);
  const db = getDb();

  const { count, error } = await db
    .from("puzzle_results")
    .select("id", { count: "exact", head: true })
    .eq("puzzle_set_id", puzzleSetId)
    .eq("player_name", playerName);

  if (error) {
    throw new Error(error.message);
  }

  const sequence = (count ?? 0) + 1;
  const playerLabel = `${playerName}#${String(sequence).padStart(3, "0")}`;

  return { playerName, playerLabel };
};

const fetchPuzzleSetByDate = async (puzzleDate: string): Promise<DbPuzzleSet | null> => {
  const db = getDb();
  const { data, error } = await db
    .from("puzzle_sets")
    .select("id, puzzle_date, set_type, title, premise, memory_minutes")
    .eq("puzzle_date", puzzleDate)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const fetchClues = async (puzzleSetId: string): Promise<DbClue[]> => {
  const db = getDb();
  const { data, error } = await db
    .from("clues")
    .select("id, puzzle_set_id, order_index, text, is_fake")
    .eq("puzzle_set_id", puzzleSetId)
    .order("order_index");

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
};

const fetchQuestions = async (puzzleSetId: string): Promise<DbQuestion[]> => {
  const db = getDb();
  const { data, error } = await db
    .from("questions")
    .select("id, puzzle_set_id, order_index, prompt, options, correct_option_index, explanation")
    .eq("puzzle_set_id", puzzleSetId)
    .order("order_index");

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((q) => ({
    ...q,
    options: q.options as string[],
  }));
};

const toPublicPuzzle = (
  set: DbPuzzleSet,
  clues: DbClue[],
  questions: DbQuestion[],
  alreadyPlayed: boolean,
): TodayPuzzleView => ({
  date: set.puzzle_date,
  themeId: set.set_type,
  title: set.title,
  premise: set.premise,
  memoryMinutes: set.memory_minutes,
  alreadyPlayed,
  clues: clues.map((c) => ({
    id: c.id,
    orderIndex: c.order_index,
    text: c.text,
  })),
  questions: questions.map((q) => ({
    id: q.id,
    orderIndex: q.order_index,
    prompt: q.prompt,
    options: q.options as [string, string, string, string],
  })),
});

export const saveGeneratedPuzzle = async (puzzleDate: string, puzzle: GeneratedPuzzle): Promise<void> => {
  const db = getDb();

  const { data: created, error: setError } = await db
    .from("puzzle_sets")
    .insert({
      puzzle_date: puzzleDate,
      set_type: puzzle.themeId,
      title: puzzle.title,
      premise: puzzle.premise,
      memory_minutes: puzzle.memoryMinutes,
    })
    .select("id")
    .single();

  if (setError || !created) {
    throw new Error(setError?.message ?? "puzzle_set_create_failed");
  }

  const setId = created.id;

  const clueRows = puzzle.clues.map((c) => ({
    puzzle_set_id: setId,
    order_index: c.orderIndex,
    text: c.text,
    is_fake: c.isFake,
  }));

  const { error: clueError } = await db.from("clues").insert(clueRows);
  if (clueError) {
    throw new Error(clueError.message);
  }

  const questionRows = puzzle.questions.map((q) => ({
    puzzle_set_id: setId,
    order_index: q.orderIndex,
    prompt: q.prompt,
    options: q.options,
    correct_option_index: q.correctOptionIndex,
    explanation: q.explanation,
  }));

  const { error: questionError } = await db.from("questions").insert(questionRows);
  if (questionError) {
    throw new Error(questionError.message);
  }
};

export const getExistingPuzzleDates = async (): Promise<string[]> => {
  const db = getDb();
  const { data, error } = await db.from("puzzle_sets").select("puzzle_date").order("puzzle_date");

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => row.puzzle_date);
};

export const generatePuzzleForDate = async (puzzleDate: string): Promise<void> => {
  await runGeneratePipeline(
    {
      gemini: getGeminiConfig(),
      savePuzzle: saveGeneratedPuzzle,
    },
    puzzleDate,
  );
};

export const runEnsureLookahead = async () => {
  return ensureLookahead({
    getExistingDates: getExistingPuzzleDates,
    generateForDate: generatePuzzleForDate,
  });
};

export const getTodayPuzzle = async (sessionId: string, puzzleDate: string): Promise<TodayPuzzleView> => {
  const set = await fetchPuzzleSetByDate(puzzleDate);
  if (!set) {
    throw new Error("puzzle_not_found");
  }

  const [clues, questions] = await Promise.all([fetchClues(set.id), fetchQuestions(set.id)]);

  const db = getDb();
  const { data: existing } = await db
    .from("puzzle_results")
    .select("id")
    .eq("puzzle_set_id", set.id)
    .eq("session_id", sessionId)
    .maybeSingle();

  return toPublicPuzzle(set, clues, questions, Boolean(existing));
};

const buildSubmitResult = (
  mode: PuzzleMode,
  timeSeconds: number,
  questions: DbQuestion[],
  clues: DbClue[],
  answers: SubmitPayload["answers"],
): SubmitResultView => {
  const { wrongCount, graded } = gradeAnswers(
    questions.map((q) => ({ id: q.id, correctOptionIndex: q.correct_option_index })),
    answers,
  );

  const gradedAnswers: GradedAnswer[] = graded.map((g) => {
    const question = questions.find((q) => q.id === g.questionId);
    return {
      questionId: g.questionId,
      selectedIndex: g.selectedIndex,
      correct: g.correct,
      correctOptionIndex: question?.correct_option_index ?? 0,
      explanation: question?.explanation ?? "",
    };
  });

  return {
    wrongCount,
    timeSeconds,
    mode,
    graded: gradedAnswers,
    clues: clues.map((c) => ({
      id: c.id,
      orderIndex: c.order_index,
      text: c.text,
      isFake: c.is_fake,
    })),
  };
};

const computeRank = async (
  puzzleSetId: string,
  wrongCount: number,
  timeSeconds: number,
): Promise<number> => {
  const db = getDb();
  const { count, error } = await db
    .from("puzzle_results")
    .select("id", { count: "exact", head: true })
    .eq("puzzle_set_id", puzzleSetId)
    .or(`wrong_count.lt.${wrongCount},and(wrong_count.eq.${wrongCount},time_seconds.lt.${timeSeconds})`);

  if (error) {
    throw new Error(error.message);
  }

  return (count ?? 0) + 1;
};

export const submitTodayPuzzle = async (
  puzzleDate: string,
  payload: unknown,
): Promise<SubmitResultView & { rank: number }> => {
  const parsed = todaySubmitPayloadSchema.parse(payload);
  const set = await fetchPuzzleSetByDate(puzzleDate);
  if (!set) {
    throw new Error("puzzle_not_found");
  }

  const db = getDb();
  const { data: existing } = await db
    .from("puzzle_results")
    .select("id")
    .eq("puzzle_set_id", set.id)
    .eq("session_id", parsed.sessionId)
    .maybeSingle();

  if (existing) {
    throw new Error("already_submitted");
  }

  const [clues, questions] = await Promise.all([fetchClues(set.id), fetchQuestions(set.id)]);
  const result = buildSubmitResult(parsed.mode, parsed.timeSeconds, questions, clues, parsed.answers);
  const { playerName, playerLabel } = await assignPlayerLabel(set.id, parsed.displayName);

  const { error: insertError } = await db.from("puzzle_results").insert({
    puzzle_set_id: set.id,
    session_id: parsed.sessionId,
    mode: parsed.mode,
    wrong_count: result.wrongCount,
    time_seconds: result.timeSeconds,
    answers: parsed.answers,
    player_name: playerName,
    player_label: playerLabel,
  });

  if (insertError) {
    throw new Error(insertError.message);
  }

  const rank = await computeRank(set.id, result.wrongCount, result.timeSeconds);
  return { ...result, rank };
};

export const getRanking = async (
  puzzleDate: string,
  sessionId?: string,
): Promise<RankingView> => {
  const set = await fetchPuzzleSetByDate(puzzleDate);
  if (!set) {
    return { date: puzzleDate, entries: [] };
  }

  const db = getDb();
  const { data, error } = await db
    .from("puzzle_results")
    .select("session_id, player_label, mode, wrong_count, time_seconds")
    .eq("puzzle_set_id", set.id)
    .order("wrong_count", { ascending: true })
    .order("time_seconds", { ascending: true })
    .limit(100);

  if (error) {
    throw new Error(error.message);
  }

  const entries: RankingEntry[] = (data ?? []).map((row, index) => ({
    rank: index + 1,
    sessionId: row.session_id,
    playerLabel: row.player_label || "익명",
    mode: row.mode,
    wrongCount: row.wrong_count,
    timeSeconds: row.time_seconds,
    isMe: sessionId ? row.session_id === sessionId : false,
  }));

  const myRank = entries.find((e) => e.isMe)?.rank;

  return { date: puzzleDate, entries, myRank };
};

export const getRankingDates = async (): Promise<string[]> => {
  const today = getKstPuzzleDate();
  const db = getDb();

  const { data: sets, error: setsError } = await db
    .from("puzzle_sets")
    .select("id, puzzle_date")
    .lte("puzzle_date", today)
    .order("puzzle_date", { ascending: false })
    .limit(60);

  if (setsError) {
    throw new Error(setsError.message);
  }

  if (!sets?.length) {
    return [];
  }

  const setIds = sets.map((s) => s.id);
  const { data: results, error: resultsError } = await db
    .from("puzzle_results")
    .select("puzzle_set_id")
    .in("puzzle_set_id", setIds);

  if (resultsError) {
    throw new Error(resultsError.message);
  }

  const setsWithResults = new Set((results ?? []).map((r) => r.puzzle_set_id));

  return sets
    .filter((s) => setsWithResults.has(s.id))
    .map((s) => s.puzzle_date);
};

export const getArchiveList = async (): Promise<ArchiveListItem[]> => {
  const today = getKstPuzzleDate();
  const db = getDb();
  const { data, error } = await db
    .from("puzzle_sets")
    .select("puzzle_date, title, set_type")
    .order("puzzle_date", { ascending: false })
    .limit(60);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => ({
    puzzleDate: row.puzzle_date,
    title: row.title,
    themeId: row.set_type,
    availability:
      row.puzzle_date < today ? "playable" : row.puzzle_date === today ? "today" : "upcoming",
  }));
};

export const getArchivePuzzle = async (puzzleDate: string): Promise<ArchivePuzzleView> => {
  assertArchiveDate(puzzleDate);
  const set = await fetchPuzzleSetByDate(puzzleDate);
  if (!set) {
    throw new Error("puzzle_not_found");
  }

  const [clues, questions] = await Promise.all([fetchClues(set.id), fetchQuestions(set.id)]);
  const view = toPublicPuzzle(set, clues, questions, false);
  return {
    date: view.date,
    themeId: view.themeId,
    title: view.title,
    premise: view.premise,
    memoryMinutes: view.memoryMinutes,
    clues: view.clues,
    questions: view.questions,
  };
};

export const submitArchivePuzzle = async (
  puzzleDate: string,
  payload: unknown,
): Promise<SubmitResultView> => {
  assertArchiveDate(puzzleDate);
  const parsed = submitPayloadSchema.parse(payload);
  const set = await fetchPuzzleSetByDate(puzzleDate);
  if (!set) {
    throw new Error("puzzle_not_found");
  }

  const [clues, questions] = await Promise.all([fetchClues(set.id), fetchQuestions(set.id)]);
  return buildSubmitResult(parsed.mode, parsed.timeSeconds, questions, clues, parsed.answers);
};
