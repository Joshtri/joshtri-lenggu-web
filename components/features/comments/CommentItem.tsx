"use client";

import { Card, CardBody, Avatar, Button, Chip } from "@heroui/react";
import { MessageCircle, Clock, Shield } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import CommentForm from "./CommentForm";
import { Comment } from "./interfaces/comments";

interface CommentItemProps {
  comment: Comment;
  postId: string;
  replies?: Comment[];
  depth?: number;
}

export default function CommentItem({ comment, postId, replies = [], depth = 0 }: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);

  const formattedDate = formatDistanceToNow(new Date(comment.createdAt), {
    addSuffix: true,
  });

  const maxDepth = 3;
  const isMaxDepth = depth >= maxDepth;

  const author = comment.author;
  const authorName = author?.name || "Anonymous";
  const authorImage = author?.image || null;
  const isAdmin = author?.role === "ADMIN";

  return (
    <div className="space-y-4">
      <Card className="border-2 border-dashed border-gray-300 dark:border-gray-700">
        <CardBody className="space-y-4">
          <div className="flex items-start gap-4">
            <Avatar
              name={authorName}
              src={authorImage || undefined}
              size="sm"
              className="flex-shrink-0"
              classNames={{
                base: isAdmin
                  ? "bg-amber-200 dark:bg-amber-900"
                  : "bg-gray-200 dark:bg-gray-700",
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="font-semibold text-gray-900 dark:text-white text-sm">
                  {authorName}
                </span>
                {isAdmin && (
                  <Chip
                    size="sm"
                    startContent={<Shield className="w-3 h-3" />}
                    variant="flat"
                    color="warning"
                    className="text-xs font-medium"
                  >
                    Admin
                  </Chip>
                )}
                <span className="text-gray-500 dark:text-gray-400 text-xs flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formattedDate}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                {comment.content}
              </p>
            </div>
          </div>

          {!isMaxDepth && (
            <div className="flex items-center gap-2 pl-12">
              <Button
                size="sm"
                variant="light"
                startContent={<MessageCircle className="w-3 h-3" />}
                onPress={() => setShowReplyForm(!showReplyForm)}
                className="text-gray-600 dark:text-gray-400"
              >
                Reply
              </Button>
            </div>
          )}

          {showReplyForm && (
            <div className="pl-12 pt-2">
              <CommentForm
                postId={postId}
                parentId={comment.id}
                onSuccess={() => setShowReplyForm(false)}
              />
            </div>
          )}
        </CardBody>
      </Card>

      {/* Nested Replies */}
      {replies.length > 0 && (
        <div className="ml-8 pl-4 border-l-2 border-dashed border-gray-300 dark:border-gray-700 space-y-4">
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              replies={[]}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
