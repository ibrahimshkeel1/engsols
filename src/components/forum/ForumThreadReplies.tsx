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
  const [removedReplyIds, setRemovedReplyIds] = useState<Set<string>>(new Set());
  const [editedBodies, setEditedBodies] = useState<Record<string, string>>({});

  const replies = useMemo(() => {
    const seen = new Set<string>();
    const merged: ForumReply[] = [];
    for (const reply of [...initialReplies, ...localReplies]) {
      if (seen.has(reply.id) || removedReplyIds.has(reply.id)) continue;
      seen.add(reply.id);
      const body = editedBodies[reply.id] ?? reply.body;
      merged.push(body === reply.body ? reply : { ...reply, body });
    }
    return merged;
  }, [initialReplies, localReplies, removedReplyIds, editedBodies]);

  function handleReplyPosted(reply: ForumReply) {
    setRemovedReplyIds((current) => {
      if (!current.has(reply.id)) return current;
      const next = new Set(current);
      next.delete(reply.id);
      return next;
    });
    setLocalReplies((current) => {
      if (current.some((item) => item.id === reply.id)) return current;
      return [...current, reply];
    });
    router.refresh();
  }

  function handleReplyDeleted(replyId: string) {
    setRemovedReplyIds((current) => new Set(current).add(replyId));
    setLocalReplies((current) => current.filter((reply) => reply.id !== replyId));
    setEditedBodies((current) => {
      if (!(replyId in current)) return current;
      const next = { ...current };
      delete next[replyId];
      return next;
    });
  }

  function handleReplyUpdated(replyId: string, body: string) {
    setEditedBodies((current) => ({ ...current, [replyId]: body }));
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
              onDeleted={handleReplyDeleted}
              onUpdated={handleReplyUpdated}
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
