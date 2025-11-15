"use client";

import { Spinner } from "@heroui/react";
import { MessageSquare } from "lucide-react";
import { useCommentsByPost } from "@/services/commentsService";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import { useMemo } from "react";
import EmptyState from "@/components/ui/Common/EmptyState";
import { Comment } from "./interfaces/comments";

interface CommentsSectionProps {
  postId: string;
}

export default function CommentsSection({ postId }: CommentsSectionProps) {
  const { data, isLoading, error } = useCommentsByPost(postId);

  const comments = data?.data || [];

  // Build comment tree structure
  const commentTree = useMemo(() => {
    const commentMap = new Map<string, Comment & { replies: Comment[] }>();
    const rootComments: (Comment & { replies: Comment[] })[] = [];

    // First pass: create map of all comments with empty replies array
    comments.forEach((comment: Comment) => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // Second pass: build tree structure
    comments.forEach((comment: Comment) => {
      const commentWithReplies = commentMap.get(comment.id)!;

      if (comment.parentId) {
        // This is a reply, add it to parent's replies
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.replies.push(commentWithReplies);
        } else {
          // Parent not found, treat as root comment
          rootComments.push(commentWithReplies);
        }
      } else {
        // This is a root comment
        rootComments.push(commentWithReplies);
      }
    });

    return rootComments;
  }, [comments]);

  const totalComments = comments.length;

  return (
    <section className="border-t-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <MessageSquare className="w-6 h-6 text-gray-900 dark:text-white" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Comments {totalComments > 0 && `(${totalComments})`}
          </h2>
        </div>

        {/* Comment Form */}
        <div className="mb-8">
          <CommentForm postId={postId} />
        </div>

        {/* Comments List */}
        <div className="space-y-6">
          {isLoading && (
            <div className="flex justify-center py-8">
              <Spinner size="lg" />
            </div>
          )}

          {error && (
            <div className="text-center py-8 text-red-500">
              Failed to load comments. Please try again.
            </div>
          )}

          {!isLoading && !error && totalComments === 0 && (
            // <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            //   No comments yet. Be the first to comment!
            // </div>
            <EmptyState
              title={""}
              description={"No comments yet. Be the first to comment!"}
            />
          )}

          {commentTree.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              replies={comment.replies}
              depth={0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
