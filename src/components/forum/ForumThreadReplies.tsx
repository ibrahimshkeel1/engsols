"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { ForumReply } from "@/types";
import { ForumReplyForm } from "@/components/forum/ForumReplyForm";
import { ForumReplyActions } from "@/components/forum/ForumReplyActions";
import { ForumGamificationBadges, isActiveThisWeek } from "@/components/forum/ForumGamificationBadges";
import { ReplyLikeButton } from "@/components/forum/ReplyLikeButton";
import { ReportContentButton } from "@/components/shared/ReportContentButton";
import { EmptyStateClient } from "@/components/shared/EmptyStateClient";
import { AttachedImages } from "@/components/shared/AttachedImages";
import { Avatar } from "@/components/ui/Avatar";
import { forumPromptChips } from "@/data/empty-state-prompts";
import { cn } from "@/lib/utils";

type ForumThreadRepliesProps = {
  postId?: string;
  initialReplies: ForumReply[];
  currentUserId?: string;
  isAdmin?: boolean;
};

export function ForumThreadReplies({
  postId,
  initialReplies,
  currentUserId,
  isAdmin = false,
}: ForumThreadRepliesProps) {
  const router = useRouter();
  const [localReplies, setLocalReplies] = useState<ForumReply[]>([]);

  const replies = useMemo(() => {
    const seen = new Set<string>();
    const merged: ForumReply[] = [];
    for (const reply of [...initialReplies, ...localReplies]) {
      if (seen.has(reply.id)) continue;
      seen.add(reply.id);
      merged.push(reply);
    }
    return merged;
  }, [initialReplies, localReplies]);

  function handleReplyPosted(reply: ForumReply) {
    setLocalReplies((current) => {
      if (current.some((item) => item.id === reply.id)) return current;
      return [...current, reply];
    });
    router.refresh();
  }

  return (
    <>
      <h2 className="mt-12 text-xl font-bold">{replies.length} Replies</h2>
      <div className="mt-4 space-y-4">
        {replies.map((reply) => (
          <div
            key={reply.id}
            className={cn(
              "rounded-2xl border border-border bg-card p-5",
              reply.isMentor && "border-l-4 border-l-primary",
            )}
          >
            <div className="flex items-center gap-2">
              <Avatar name={reply.author} size="sm" src={reply.authorAvatarUrl} />
              <span className="font-medium">{reply.author}</span>
              <ForumGamificationBadges
                reputation={reply.forumReputation}
                likes={reply.likes}
                isMentor={reply.isMentor}
                activeThisWeek={isActiveThisWeek(reply.createdAt)}
              />
              <span className="text-xs text-muted-foreground">{reply.createdAt}</span>
            </div>
            <p className="mt-2 text-foreground/90">{reply.body}</p>
            <AttachedImages urls={reply.imageUrls ?? []} />
            <div className="mt-2 flex items-center gap-2">
              <ReplyLikeButton replyId={reply.id} likes={reply.likes} />
              <ReportContentButton contentType="forum_reply" contentId={reply.id} />
            </div>
            <ForumReplyActions
              replyId={reply.id}
              body={reply.body}
              canEdit={currentUserId === reply.authorId || isAdmin}
            />
          </div>
        ))}
        {replies.length === 0 && (
          <EmptyStateClient
            title="No replies yet"
            description="Be the first to share your experience or ask a follow-up."
            action={{ href: "#reply-form", label: "Write a reply" }}
            promptChips={forumPromptChips}
          />
        )}
      </div>
      <ForumReplyForm postId={postId} onReplyPosted={handleReplyPosted} />
    </>
  );
}
