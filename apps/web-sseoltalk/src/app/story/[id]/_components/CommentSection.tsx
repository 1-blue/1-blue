"use client";

import { useState } from "react";
import { Button } from "@1-blue/ui/components/button";
import { Input } from "@1-blue/ui/components/input";
import { AutoResizeTextarea } from "@/app/story/[id]/_components/AutoResizeTextarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@1-blue/ui/components/dialog";
import { formatRelativeTime } from "@/lib/kst";
import type { CommentTree } from "@/lib/repository";
import { getSessionId } from "@/app/_hooks/useSessionId";
import { cn } from "@1-blue/ui/lib/index";

type CommentSectionProps = {
  storyId: string;
  comments: CommentTree[];
  onRefresh: () => void;
};

export const CommentSection = ({ storyId, comments, onRefresh }: CommentSectionProps) => {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [content, setContent] = useState("");
  const [replyParentId, setReplyParentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"edit" | "delete">("edit");
  const [targetCommentId, setTargetCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [actionPassword, setActionPassword] = useState("");

  const submitComment = async () => {
    if (!nickname.trim() || !password.trim() || !content.trim()) {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`/api/stories/${storyId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: getSessionId(),
          nickname: nickname.trim(),
          password,
          content: content.trim(),
          parentCommentId: replyParentId,
        }),
      });
      if (!response.ok) {
        return;
      }
      setContent("");
      setReplyParentId(null);
      onRefresh();
    } finally {
      setLoading(false);
    }
  };

  const openAction = (commentId: string, mode: "edit" | "delete", currentContent?: string) => {
    setTargetCommentId(commentId);
    setDialogMode(mode);
    setEditContent(currentContent ?? "");
    setActionPassword("");
    setDialogOpen(true);
  };

  const runAction = async () => {
    if (!targetCommentId) {
      return;
    }
    setLoading(true);
    try {
      if (dialogMode === "edit") {
        await fetch(`/api/stories/${storyId}/comments/${targetCommentId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: actionPassword, content: editContent }),
        });
      } else {
        await fetch(`/api/stories/${storyId}/comments/${targetCommentId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: actionPassword }),
        });
      }
      setDialogOpen(false);
      onRefresh();
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (commentId: string) => {
    await fetch(`/api/stories/${storyId}/comments/${commentId}/likes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: getSessionId() }),
    });
    onRefresh();
  };

  const renderComment = (
    comment: CommentTree["replies"][number] | CommentTree,
    isReply = false,
  ) => (
    <div
      key={comment.id}
      className={cn("space-y-2", isReply && "border-border ml-6 border-l pl-3")}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold break-words">{comment.nickname}</p>
          <p className="text-text-secondary text-[11px]">{formatRelativeTime(comment.createdAt)}</p>
        </div>
        {!comment.isDeleted && (
          <div className="flex shrink-0 gap-1 text-xs">
            <button
              type="button"
              className="text-text-secondary cursor-pointer hover:text-text-primary"
              onClick={() => openAction(comment.id, "edit", comment.content)}
            >
              수정
            </button>
            <button
              type="button"
              className="text-text-secondary cursor-pointer hover:text-text-primary"
              onClick={() => openAction(comment.id, "delete")}
            >
              삭제
            </button>
          </div>
        )}
      </div>
      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{comment.content}</p>
      <div className="flex items-center gap-3 text-xs">
        <button
          type="button"
          onClick={() => void toggleLike(comment.id)}
          className="text-text-secondary cursor-pointer hover:text-text-primary"
        >
          {comment.likedByMe ? "❤️" : "🤍"} {comment.likeCount}
        </button>
        {!isReply && (
          <button
            type="button"
            className="text-text-secondary cursor-pointer hover:text-text-primary"
            onClick={() => setReplyParentId(comment.id)}
          >
            답글
          </button>
        )}
      </div>
    </div>
  );

  return (
    <section className="bg-surface-secondary px-4 py-4">
      <h2 className="mb-4 text-base font-semibold">댓글 {comments.length}</h2>
      {comments.length === 0 ? (
        <p className="text-text-secondary py-6 text-center text-sm">첫 댓글을 남겨보세요 ✍️</p>
      ) : (
        <div className="space-y-5">
          {comments.map((comment) => (
            <div key={comment.id} className="space-y-3">
              {renderComment(comment)}
              {comment.replies.map((reply) => renderComment(reply, true))}
            </div>
          ))}
        </div>
      )}

      <div className="border-border bg-surface sticky bottom-0 mt-4 space-y-2 border-t p-3">
        {replyParentId && (
          <p className="text-text-secondary text-xs">
            답글 작성 중{" "}
            <button
              type="button"
              className="cursor-pointer underline"
              onClick={() => setReplyParentId(null)}
            >
              취소
            </button>
          </p>
        )}
        <div className="grid gap-2 sm:grid-cols-2">
          <Input
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <Input
            type="password"
            placeholder="비밀번호 (수정/삭제용)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <p className="text-text-tertiary text-[11px]">비밀번호 분실 시 복구할 수 없습니다.</p>
        <div className="flex items-end gap-2">
          <AutoResizeTextarea
            placeholder="댓글 남기기"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-11 flex-1"
          />
          <Button
            className="cursor-pointer"
            onClick={() => void submitComment()}
            disabled={loading || !nickname.trim() || !password.trim() || !content.trim()}
          >
            등록
          </Button>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogMode === "edit" ? "댓글 수정" : "댓글 삭제"}</DialogTitle>
          </DialogHeader>
          {dialogMode === "edit" && (
            <AutoResizeTextarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
          )}
          <Input
            type="password"
            placeholder="비밀번호"
            value={actionPassword}
            onChange={(e) => setActionPassword(e.target.value)}
          />
          <Button onClick={() => void runAction()} disabled={loading}>
            {dialogMode === "edit" ? "수정하기" : "삭제하기"}
          </Button>
        </DialogContent>
      </Dialog>
    </section>
  );
};
