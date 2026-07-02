"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@1-blue/ui/components/button";
import { Textarea } from "@1-blue/ui/components/textarea";
import { LikeButton } from "@/app/cbt/[public_id]/_components/LikeButton";
import type { CbtCommentView } from "@/lib/repository";

type CommentsSectionProps = {
  publicId: string;
  attemptId?: string | null;
  canInteract: boolean;
  showCompose?: boolean;
};

export const CommentsSection = ({
  publicId,
  attemptId,
  canInteract,
  showCompose = false,
}: CommentsSectionProps) => {
  const [comments, setComments] = useState<CbtCommentView[]>([]);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const hasMyComment = comments.some((c) => c.isMine);

  const load = useCallback(async () => {
    const qs = attemptId ? `?attemptId=${encodeURIComponent(attemptId)}` : "";
    const response = await fetch(`/api/cbts/${publicId}/comments${qs}`);
    if (response.ok) {
      const data = (await response.json()) as { items: CbtCommentView[] };
      setComments(data.items);
    }
  }, [attemptId, publicId]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleSubmit = async () => {
    if (!attemptId || !content.trim()) {
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch(`/api/cbts/${publicId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attemptId, content }),
      });
      if (response.ok) {
        setContent("");
        await load();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const toggleCommentLike = async (commentId: string) => {
    if (!attemptId || !canInteract) {
      return;
    }
    const response = await fetch(`/api/cbts/${publicId}/comments/${commentId}/likes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attemptId }),
    });
    if (response.ok) {
      const data = (await response.json()) as { liked: boolean; likeCount: number };
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId ? { ...c, likedByMe: data.liked, likeCount: data.likeCount } : c,
        ),
      );
    }
  };

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-bold">후기</h2>
      {showCompose && canInteract && attemptId && !hasMyComment && (
        <div className="surface-card space-y-3 p-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="시험 후기를 남겨주세요"
            rows={3}
            maxLength={500}
          />
          <Button
            type="button"
            size="sm"
            disabled={submitting || !content.trim()}
            onClick={() => void handleSubmit()}
          >
            후기 등록
          </Button>
        </div>
      )}
      {comments.length === 0 ? (
        <p className="text-muted-foreground text-sm">아직 후기가 없습니다.</p>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="surface-card p-4">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-sm font-semibold">{comment.nickname}</span>
                <LikeButton
                  liked={comment.likedByMe}
                  count={comment.likeCount}
                  disabled={!canInteract || !attemptId}
                  onToggle={() => void toggleCommentLike(comment.id)}
                />
              </div>
              <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
