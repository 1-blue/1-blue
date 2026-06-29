import {
  GENERATION_SYSTEM_PROMPT,
  MAX_GENERATION_RETRIES,
  buildGenerationUserPrompt,
  canReplyToComment,
  isReactionType,
  isValidationPassing,
  parseValidationResult,
  validateCommentInput,
  validateGeneratedStory,
  type GeneratedStory,
  type ReactionType,
  type StoryCategory,
} from "@1-blue/core/sseoltalk";
import { getKstDaysAgo, getKstToday } from "@/lib/kst";
import { hashPassword, verifyPassword } from "@/lib/password";
import { generateStoryWithGemini, validateStoryWithGemini } from "@/lib/ai/gemini";
import { getDb } from "@/lib/db";

const PAGE_SIZE = 20;

export type StoryListItem = {
  id: string;
  category: string;
  title: string;
  publishedAt: string | null;
  viewCount: number;
  reactionCounts: Record<ReactionType, number>;
  commentCount: number;
  previewMessages: Array<{ sender: string; isMe: boolean; content: string }>;
  createdAt: string;
};

export type StoryDetail = {
  id: string;
  category: string;
  title: string;
  counterpartName: string;
  publishedAt: string | null;
  viewCount: number;
  messages: Array<{
    id: string;
    sender: string;
    isMe: boolean;
    content: string;
    orderIndex: number;
  }>;
  reactionCounts: Record<ReactionType, number>;
  myReactions: ReactionType[];
  comments: CommentTree[];
};

export type CommentTree = {
  id: string;
  nickname: string;
  content: string;
  likeCount: number;
  likedByMe: boolean;
  createdAt: string;
  isDeleted: boolean;
  replies: Array<{
    id: string;
    nickname: string;
    content: string;
    likeCount: number;
    likedByMe: boolean;
    createdAt: string;
    isDeleted: boolean;
  }>;
};

const emptyReactionCounts = (): Record<ReactionType, number> => ({
  lol: 0,
  agree: 0,
  shock: 0,
  angry: 0,
});

const resolveCounterpartName = (messages: Array<{ sender: string; is_me: boolean }>): string => {
  const other = messages.find((m) => !m.is_me);
  return other?.sender ?? "대화";
};

const aggregateReactions = (
  rows: Array<{ story_id: string; type: string }>,
): Map<string, Record<ReactionType, number>> => {
  const map = new Map<string, Record<ReactionType, number>>();
  for (const row of rows) {
    if (!isReactionType(row.type)) {
      continue;
    }
    const counts = map.get(row.story_id) ?? emptyReactionCounts();
    counts[row.type] += 1;
    map.set(row.story_id, counts);
  }
  return map;
};

const buildStoryListItems = async (
  storyRows: Array<{
    id: string;
    category: string;
    title: string;
    published_at: string | null;
    view_count: number;
    created_at: string;
  }>,
): Promise<StoryListItem[]> => {
  if (storyRows.length === 0) {
    return [];
  }

  const db = getDb();
  const ids = storyRows.map((s) => s.id);

  const [messagesRes, reactionsRes, commentsRes] = await Promise.all([
    db
      .from("messages")
      .select("story_id, sender, is_me, content, order_index")
      .in("story_id", ids)
      .order("order_index"),
    db.from("reactions").select("story_id, type").in("story_id", ids),
    db
      .from("comments")
      .select("story_id, id")
      .in("story_id", ids)
      .is("deleted_at", null),
  ]);

  const previewByStory = new Map<string, Array<{ sender: string; isMe: boolean; content: string }>>();
  for (const row of messagesRes.data ?? []) {
    const list = previewByStory.get(row.story_id) ?? [];
    if (list.length < 2) {
      list.push({ sender: row.sender, isMe: row.is_me, content: row.content });
      previewByStory.set(row.story_id, list);
    }
  }

  const reactionMap = aggregateReactions(reactionsRes.data ?? []);

  const commentCountMap = new Map<string, number>();
  for (const row of commentsRes.data ?? []) {
    commentCountMap.set(row.story_id, (commentCountMap.get(row.story_id) ?? 0) + 1);
  }

  return storyRows.map((story) => ({
    id: story.id,
    category: story.category,
    title: story.title,
    publishedAt: story.published_at,
    viewCount: story.view_count,
    reactionCounts: reactionMap.get(story.id) ?? emptyReactionCounts(),
    commentCount: commentCountMap.get(story.id) ?? 0,
    previewMessages: previewByStory.get(story.id) ?? [],
    createdAt: story.created_at,
  }));
};

export const listPublishedStories = async (options?: {
  category?: StoryCategory;
  cursor?: string;
  limit?: number;
}): Promise<{ items: StoryListItem[]; nextCursor: string | null }> => {
  const db = getDb();
  const limit = options?.limit ?? PAGE_SIZE;

  let query = db
    .from("stories")
    .select("id, category, title, published_at, view_count, created_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit + 1);

  if (options?.category) {
    query = query.eq("category", options.category);
  }
  if (options?.cursor) {
    query = query.lt("created_at", options.cursor);
  }

  const { data, error } = await query;
  if (error || !data) {
    return { items: [], nextCursor: null };
  }

  const hasMore = data.length > limit;
  const page = hasMore ? data.slice(0, limit) : data;
  const items = await buildStoryListItems(page);
  const nextCursor = hasMore ? page[page.length - 1]!.created_at : null;

  return { items, nextCursor };
};

export const getPublishedStoryIds = async (): Promise<string[]> => {
  const stories = await getPublishedStoriesForSitemap();
  return stories.map((s) => s.id);
};

export const getPublishedStoriesForSitemap = async (): Promise<
  Array<{ id: string; publishedAt: string | null }>
> => {
  const db = getDb();
  const { data } = await db
    .from("stories")
    .select("id, published_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false });
  return (data ?? []).map((s) => ({ id: s.id, publishedAt: s.published_at }));
};

export const getStoryDetail = async (
  storyId: string,
  sessionId?: string,
): Promise<StoryDetail | null> => {
  const db = getDb();
  const { data: story, error } = await db
    .from("stories")
    .select("*")
    .eq("id", storyId)
    .eq("is_published", true)
    .single();

  if (error || !story) {
    return null;
  }

  const [messagesRes, reactionsRes, myReactionsRes, commentsRes] = await Promise.all([
    db.from("messages").select("*").eq("story_id", storyId).order("order_index"),
    db.from("reactions").select("type").eq("story_id", storyId),
    sessionId
      ? db.from("reactions").select("type").eq("story_id", storyId).eq("session_id", sessionId)
      : Promise.resolve({ data: [] }),
    db
      .from("comments")
      .select("*")
      .eq("story_id", storyId)
      .order("created_at", { ascending: true }),
  ]);

  const messages = messagesRes.data ?? [];
  const reactionCounts = emptyReactionCounts();
  for (const row of reactionsRes.data ?? []) {
    if (isReactionType(row.type)) {
      reactionCounts[row.type] += 1;
    }
  }

  const myReactions = (myReactionsRes.data ?? [])
    .map((r) => r.type)
    .filter((t): t is ReactionType => isReactionType(t));

  const commentRows = commentsRes.data ?? [];
  const commentIds = commentRows.map((c) => c.id);
  const likesRes =
    commentIds.length > 0
      ? await db.from("comment_likes").select("comment_id, session_id").in("comment_id", commentIds)
      : { data: [] };

  const likeCountMap = new Map<string, number>();
  const myLikes = new Set<string>();
  for (const like of likesRes.data ?? []) {
    likeCountMap.set(like.comment_id, (likeCountMap.get(like.comment_id) ?? 0) + 1);
    if (sessionId && like.session_id === sessionId) {
      myLikes.add(like.comment_id);
    }
  }

  const topLevel = commentRows.filter((c) => !c.parent_comment_id);
  const repliesByParent = new Map<string, typeof commentRows>();
  for (const c of commentRows) {
    if (c.parent_comment_id) {
      const list = repliesByParent.get(c.parent_comment_id) ?? [];
      list.push(c);
      repliesByParent.set(c.parent_comment_id, list);
    }
  }

  const mapComment = (c: (typeof commentRows)[number]) => ({
    id: c.id,
    nickname: c.nickname,
    content: c.deleted_at ? "삭제된 댓글입니다" : c.content,
    likeCount: likeCountMap.get(c.id) ?? c.like_count,
    likedByMe: myLikes.has(c.id),
    createdAt: c.created_at,
    isDeleted: Boolean(c.deleted_at),
  });

  const comments: CommentTree[] = topLevel.map((c) => ({
    ...mapComment(c),
    replies: (repliesByParent.get(c.id) ?? []).map(mapComment),
  }));

  return {
    id: story.id,
    category: story.category,
    title: story.title,
    counterpartName: story.counterpart_name ?? resolveCounterpartName(messages),
    publishedAt: story.published_at,
    viewCount: story.view_count,
    messages: messages.map((m) => ({
      id: m.id,
      sender: m.sender,
      isMe: m.is_me,
      content: m.content,
      orderIndex: m.order_index,
    })),
    reactionCounts,
    myReactions,
    comments,
  };
};

export const incrementStoryView = async (
  storyId: string,
  sessionId: string,
): Promise<{ viewCount: number; counted: boolean }> => {
  const db = getDb();
  const { data: story } = await db
    .from("stories")
    .select("id, view_count, is_published")
    .eq("id", storyId)
    .single();

  if (!story?.is_published) {
    throw new Error("story_not_found");
  }

  const { error: insertError } = await db.from("story_views").insert({
    story_id: storyId,
    session_id: sessionId,
  });

  if (insertError) {
    return { viewCount: story.view_count, counted: false };
  }

  const newCount = story.view_count + 1;
  await db.from("stories").update({ view_count: newCount }).eq("id", storyId);
  return { viewCount: newCount, counted: true };
};

export const toggleReaction = async (
  storyId: string,
  sessionId: string,
  type: ReactionType,
): Promise<{ active: boolean; reactionCounts: Record<ReactionType, number> }> => {
  const db = getDb();
  const { data: story } = await db.from("stories").select("id").eq("id", storyId).eq("is_published", true).single();
  if (!story) {
    throw new Error("story_not_found");
  }

  const { data: existing } = await db
    .from("reactions")
    .select("id")
    .eq("story_id", storyId)
    .eq("session_id", sessionId)
    .eq("type", type)
    .maybeSingle();

  if (existing) {
    await db.from("reactions").delete().eq("id", existing.id);
  } else {
    await db.from("reactions").insert({ story_id: storyId, session_id: sessionId, type });
  }

  const { data: all } = await db.from("reactions").select("type").eq("story_id", storyId);
  const reactionCounts = emptyReactionCounts();
  for (const row of all ?? []) {
    if (isReactionType(row.type)) {
      reactionCounts[row.type] += 1;
    }
  }

  return { active: !existing, reactionCounts };
};

export const createComment = async (
  storyId: string,
  sessionId: string,
  input: { nickname: string; password: string; content: string; parentCommentId?: string | null },
) => {
  const validated = validateCommentInput(input);
  const db = getDb();

  const { data: story } = await db.from("stories").select("id").eq("id", storyId).eq("is_published", true).single();
  if (!story) {
    throw new Error("story_not_found");
  }

  if (validated.parentCommentId) {
    const { data: parent } = await db
      .from("comments")
      .select("id, parent_comment_id")
      .eq("id", validated.parentCommentId)
      .eq("story_id", storyId)
      .single();

    if (!parent) {
      throw new Error("parent_not_found");
    }
    if (!canReplyToComment(Boolean(parent.parent_comment_id))) {
      throw new Error("reply_depth_exceeded");
    }
  }

  const { hash, salt } = hashPassword(validated.password);
  const { data, error } = await db
    .from("comments")
    .insert({
      story_id: storyId,
      parent_comment_id: validated.parentCommentId,
      session_id: sessionId,
      nickname: validated.nickname,
      password_hash: hash,
      password_salt: salt,
      content: validated.content,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "comment_create_failed");
  }

  return {
    id: data.id,
    nickname: data.nickname,
    content: data.content,
    parentCommentId: data.parent_comment_id,
    createdAt: data.created_at,
  };
};

export const updateComment = async (
  storyId: string,
  commentId: string,
  password: string,
  content: string,
) => {
  const trimmed = content.trim();
  if (trimmed.length < 1 || trimmed.length > 500) {
    throw new Error("invalid_content");
  }

  const db = getDb();
  const { data: comment } = await db
    .from("comments")
    .select("*")
    .eq("id", commentId)
    .eq("story_id", storyId)
    .single();

  if (!comment || comment.deleted_at) {
    throw new Error("comment_not_found");
  }
  if (!verifyPassword(password, comment.password_hash, comment.password_salt)) {
    throw new Error("invalid_password");
  }

  const { data, error } = await db
    .from("comments")
    .update({ content: trimmed, updated_at: new Date().toISOString() })
    .eq("id", commentId)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "comment_update_failed");
  }

  return { id: data.id, content: data.content, updatedAt: data.updated_at };
};

export const deleteComment = async (storyId: string, commentId: string, password: string) => {
  const db = getDb();
  const { data: comment } = await db
    .from("comments")
    .select("*")
    .eq("id", commentId)
    .eq("story_id", storyId)
    .single();

  if (!comment || comment.deleted_at) {
    throw new Error("comment_not_found");
  }
  if (!verifyPassword(password, comment.password_hash, comment.password_salt)) {
    throw new Error("invalid_password");
  }

  await db
    .from("comments")
    .update({ deleted_at: new Date().toISOString(), content: "삭제된 댓글입니다" })
    .eq("id", commentId);

  return { ok: true };
};

export const toggleCommentLike = async (
  storyId: string,
  commentId: string,
  sessionId: string,
) => {
  const db = getDb();
  const { data: comment } = await db
    .from("comments")
    .select("id")
    .eq("id", commentId)
    .eq("story_id", storyId)
    .is("deleted_at", null)
    .single();

  if (!comment) {
    throw new Error("comment_not_found");
  }

  const { data: existing } = await db
    .from("comment_likes")
    .select("id")
    .eq("comment_id", commentId)
    .eq("session_id", sessionId)
    .maybeSingle();

  if (existing) {
    await db.from("comment_likes").delete().eq("id", existing.id);
  } else {
    await db.from("comment_likes").insert({ comment_id: commentId, session_id: sessionId });
  }

  const { count } = await db
    .from("comment_likes")
    .select("*", { count: "exact", head: true })
    .eq("comment_id", commentId);

  const likeCount = count ?? 0;
  await db.from("comments").update({ like_count: likeCount }).eq("id", commentId);

  return { liked: !existing, likeCount };
};

export const listPopularToday = async (): Promise<StoryListItem[]> => {
  const db = getDb();
  const since = getKstDaysAgo(14);

  const { data: stories } = await db
    .from("stories")
    .select("id, category, title, published_at, view_count, created_at")
    .eq("is_published", true)
    .gte("published_at", since)
    .order("published_at", { ascending: false })
    .limit(50);

  let pool = stories ?? [];

  if (pool.length === 0) {
    const { data: latest } = await db
      .from("stories")
      .select("id, category, title, published_at, view_count, created_at")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(10);
    pool = latest ?? [];
  }

  if (!pool.length) {
    return [];
  }

  const ids = pool.map((s) => s.id);
  const { data: reactions } = await db.from("reactions").select("story_id, type").in("story_id", ids);

  const scoreMap = new Map<string, number>();
  for (const row of reactions ?? []) {
    scoreMap.set(row.story_id, (scoreMap.get(row.story_id) ?? 0) + 1);
  }

  const sorted = [...pool].sort((a, b) => {
    const scoreDiff = (scoreMap.get(b.id) ?? 0) - (scoreMap.get(a.id) ?? 0);
    if (scoreDiff !== 0) {
      return scoreDiff;
    }
    return b.view_count - a.view_count;
  });

  return buildStoryListItems(sorted.slice(0, 10));
};

export const getRandomStoryId = async (): Promise<string | null> => {
  const db = getDb();
  const { data } = await db.from("stories").select("id").eq("is_published", true);
  if (!data?.length) {
    return null;
  }
  const pick = data[Math.floor(Math.random() * data.length)]!;
  return pick.id;
};

const persistGeneratedStory = async (
  story: GeneratedStory,
  meta: {
    qualityScore: number;
    qualityIssues: string[];
    generationModel: string;
    validationModel: string;
  },
) => {
  const db = getDb();
  const counterpartName = resolveCounterpartName(
    story.messages.map((m) => ({ sender: m.sender, is_me: m.is_me })),
  );

  const { data: inserted, error } = await db
    .from("stories")
    .insert({
      category: story.category,
      title: story.title,
      counterpart_name: counterpartName,
      is_published: false,
      quality_score: meta.qualityScore,
      quality_issues: meta.qualityIssues,
      generation_model: meta.generationModel,
      validation_model: meta.validationModel,
    })
    .select("id")
    .single();

  if (error || !inserted) {
    throw new Error(error?.message ?? "story_insert_failed");
  }

  const messageRows = story.messages.map((m) => ({
    story_id: inserted.id,
    sender: m.sender,
    is_me: m.is_me,
    content: m.content,
    order_index: m.order_index,
  }));

  const { error: msgError } = await db.from("messages").insert(messageRows);
  if (msgError) {
    await db.from("stories").delete().eq("id", inserted.id);
    throw new Error(msgError.message);
  }

  return inserted.id;
};

export const generateStories = async (options?: {
  count?: number;
  category?: StoryCategory;
}): Promise<{
  created: string[];
  discarded: Array<{ reason: string; score?: number }>;
}> => {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    throw new Error("ai_not_configured");
  }

  const generationModel = process.env.GEMINI_GENERATION_MODEL ?? "gemini-2.5-pro";
  const geminiModel = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
  const count = options?.count ?? 1;
  const created: string[] = [];
  const discarded: Array<{ reason: string; score?: number }> = [];

  for (let i = 0; i < count; i += 1) {
    let saved = false;
    for (let attempt = 1; attempt <= MAX_GENERATION_RETRIES; attempt += 1) {
      try {
        const raw = await generateStoryWithGemini(
          { apiKey: geminiKey, model: generationModel },
          GENERATION_SYSTEM_PROMPT,
          buildGenerationUserPrompt(options?.category),
        );
        const story = validateGeneratedStory(raw);
        const validationRaw = await validateStoryWithGemini(
          { apiKey: geminiKey, model: geminiModel },
          story,
        );
        const validation = parseValidationResult(validationRaw);

        if (!isValidationPassing(validation)) {
          throw new Error(`validation_failed:${validation.score}`);
        }

        const id = await persistGeneratedStory(story, {
          qualityScore: validation.score,
          qualityIssues: validation.issues,
          generationModel: generationModel,
          validationModel: geminiModel,
        });
        created.push(id);
        saved = true;
        break;
      } catch (error) {
        const message = error instanceof Error ? error.message : "unknown_error";
        const scoreMatch = message.match(/validation_failed:(\d+)/);
        if (attempt === MAX_GENERATION_RETRIES) {
          discarded.push({
            reason: message,
            score: scoreMatch ? Number(scoreMatch[1]) : undefined,
          });
        }
      }
    }
    if (!saved && created.length === 0 && discarded.length === 0) {
      discarded.push({ reason: "generation_failed" });
    }
  }

  return { created, discarded };
};

export const hasPublishedStoryOn = async (date: string): Promise<boolean> => {
  const db = getDb();
  const { count, error } = await db
    .from("stories")
    .select("id", { count: "exact", head: true })
    .eq("is_published", true)
    .eq("published_at", date);

  if (error) {
    throw new Error(error.message);
  }

  return (count ?? 0) > 0;
};

export const publishStoryById = async (
  id: string,
  publishedAt: string,
): Promise<void> => {
  const db = getDb();
  const { error } = await db
    .from("stories")
    .update({
      is_published: true,
      published_at: publishedAt,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("is_published", false);

  if (error) {
    throw new Error(error.message);
  }
};

export const publishPendingStories = async (): Promise<{ publishedIds: string[] }> => {
  const db = getDb();
  const today = getKstToday();

  const { data: pending } = await db
    .from("stories")
    .select("id")
    .eq("is_published", false)
    .order("created_at", { ascending: true });

  if (!pending?.length) {
    return { publishedIds: [] };
  }

  const ids = pending.map((s) => s.id);
  const { error } = await db
    .from("stories")
    .update({ is_published: true, published_at: today, updated_at: new Date().toISOString() })
    .in("id", ids);

  if (error) {
    throw new Error(error.message);
  }

  return { publishedIds: ids };
};

export const getStoryForMetadata = async (storyId: string) => {
  const db = getDb();
  const { data } = await db
    .from("stories")
    .select("id, title, category, published_at, is_published")
    .eq("id", storyId)
    .eq("is_published", true)
    .single();

  if (!data) {
    return null;
  }

  const { data: messages } = await db
    .from("messages")
    .select("content, sender, is_me")
    .eq("story_id", storyId)
    .order("order_index")
    .limit(3);

  return {
    ...data,
    previewMessages: (messages ?? []).map((m) => ({
      sender: m.sender,
      isMe: m.is_me,
      content: m.content,
    })),
  };
};
