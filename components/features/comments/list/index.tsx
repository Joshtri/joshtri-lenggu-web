"use client";

import { ListGrid } from "@/components/ui/ListGrid";
import { useDeleteComment } from "@/services/commentsService";
import React from "react";
import { Comment } from "../interfaces/comments";
import { ACTION_BUTTONS } from "@/components/ui/Button/ActionButtons";

export default function CommentList() {
  const deleteComment = useDeleteComment();

  const columns = [
    {
      key: "content",
      label: "Name",
      value: (comment: Comment) => <span>{comment.content}</span>,
    },

    {
      key: "postId",
      label: "Postingan",
      value: (comment: Comment) => <span>{comment.postId}</span>,
    },
    {
      key: "createdAt",
      label: "Created At",
      value: (comment: Comment) => (
        <span className="text-xs text-gray-500">
          {new Date(comment.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
  ];

  const handleDelete = (id: string) => {
    return deleteComment.mutateAsync(id);
  };

  return (
    <>
      <ListGrid<Comment>
        title="Comment Lists"
        resourcePath="/comments"
        columns={columns}
        onSearch={(_query) => {}}
        actionButtons={{
          delete: ACTION_BUTTONS.DELETE(handleDelete),
        }}
        searchPlaceholder="Search comment by content, posts title ..."
        // onDelete={handleDelete}
        deleteConfirmTitle="Delete Comment"
        deleteConfirmMessage={(comment) =>
          `Are you sure you want to delete this comment "${comment.content?.substring(
            0,
            30
          )}..."?`
        }
        keyField="id"
        idField="id"
        nameField="content"
        pageSize={10}
        showPagination={true}
      />
    </>
  );
}
