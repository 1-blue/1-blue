"use client";

import { ROUTES } from "@/app/_constants/routes";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { ReactionType } from "@/core";
import { AdSensePlaceholder } from "@/app/_components/AdSensePlaceholder";
import { AppShell } from "@/app/_components/AppShell";
import {
  ChatBubble,
  ChatDateDivider,
  ChatRoomHeader,
} from "@/app/story/[id]/_components/ChatBubble";
import { CommentSection } from "@/app/story/[id]/_components/CommentSection";
import { ReactionBar } from "@/app/story/[id]/_components/ReactionBar";
import type { StoryDetail } from "@/lib/repository";
import { getSessionId } from "@/app/_hooks/useSessionId";

type StoryPageClientProps = {
  storyId: string;
  initialStory?: StoryDetail | null;
};

export const StoryPageClient = ({ storyId, initialStory }: StoryPageClientProps) => {
  const router = useRouter();
  const [story, setStory] = useState<StoryDetail | null>(initialStory ?? null);
  const [loading, setLoading] = useState(initialStory === undefined);

  const load = useCallback(async () => {
    const sessionId = getSessionId();
    const response = await fetch(
      `/api/stories/${storyId}?sessionId=${encodeURIComponent(sessionId)}`,
    );
    if (response.ok) {
      setStory((await response.json()) as StoryDetail);
    } else {
      setStory(null);
    }
  }, [storyId]);

  useEffect(() => {
    if (initialStory !== undefined) {
      void load();
      return;
    }
    setLoading(true);
    void load().finally(() => setLoading(false));
  }, [initialStory, load]);

  useEffect(() => {
    const sessionId = getSessionId();
    if (!sessionId) {
      return;
    }
    void fetch(`/api/stories/${storyId}/view`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });
  }, [storyId]);

  const toggleReaction = async (type: ReactionType) => {
    if (!story) {
      return;
    }

    const wasActive = story.myReactions.includes(type);
    const snapshot = story;
    const optimisticCounts = { ...story.reactionCounts };
    optimisticCounts[type] = Math.max(0, optimisticCounts[type] + (wasActive ? -1 : 1));
    const optimisticMyReactions = wasActive
      ? story.myReactions.filter((r) => r !== type)
      : [...story.myReactions, type];

    setStory({
      ...story,
      reactionCounts: optimisticCounts,
      myReactions: optimisticMyReactions,
    });

    try {
      const response = await fetch(`/api/stories/${storyId}/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: getSessionId(), type }),
      });
      if (!response.ok) {
        setStory(snapshot);
        return;
      }
      const result = (await response.json()) as {
        active: boolean;
        reactionCounts: Record<ReactionType, number>;
      };
      setStory((current) =>
        current
          ? {
              ...current,
              reactionCounts: result.reactionCounts,
              myReactions: result.active
                ? [...current.myReactions.filter((r) => r !== type), type]
                : current.myReactions.filter((r) => r !== type),
            }
          : current,
      );
    } catch {
      setStory(snapshot);
    }
  };

  if (loading) {
    return (
      <AppShell hideBottomNav>
        <div className="surface-card mx-4 mt-6 h-96 animate-pulse" />
      </AppShell>
    );
  }

  if (!story) {
    return (
      <AppShell hideBottomNav>
        <div className="p-8 text-center">
          <p>썰을 찾을 수 없습니다.</p>
        </div>
      </AppShell>
    );
  }

  let lastSender = "";

  return (
    <AppShell hideBottomNav>
      <div className="flex min-h-dvh flex-col">
        <ChatRoomHeader
          title={story.counterpartName}
          subtitle={story.category}
          onBack={() => (window.history.length > 1 ? router.back() : router.push(ROUTES.HOME.path))}
        />
        <div className="chat-bg flex-1 space-y-3 px-4 py-4">
          <ChatDateDivider label="오늘" />
          {story.messages.map((msg) => {
            const showSender = !msg.isMe && msg.sender !== lastSender;
            if (!msg.isMe) {
              lastSender = msg.sender;
            }
            return (
              <ChatBubble
                key={msg.id}
                sender={msg.sender}
                content={msg.content}
                isMe={msg.isMe}
                showSender={showSender}
              />
            );
          })}
        </div>
        <ReactionBar
          counts={story.reactionCounts}
          active={story.myReactions}
          onToggle={(type) => void toggleReaction(type)}
        />
        <div className="px-4 py-3">
          <AdSensePlaceholder slotId="story-before-comments-mobile" />
        </div>
        <CommentSection storyId={storyId} comments={story.comments} onRefresh={() => void load()} />
      </div>
    </AppShell>
  );
};
