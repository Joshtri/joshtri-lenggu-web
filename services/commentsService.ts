"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { ApiResponse, QueryParams } from "@/interfaces/api";
import { Comment, CreateCommentInput, UpdateCommentInput } from "@/components/features/comments/interfaces/comments";
import { Toast } from "@/components/ui/Toast";

// Query keys
export const commentsKeys = {
  all: ["comments"] as const,
  lists: () => [...commentsKeys.all, "list"] as const,
  list: (params?: QueryParams) => [...commentsKeys.lists(), params] as const,
  byPost: (postId: string) => [...commentsKeys.all, "post", postId] as const,
  details: () => [...commentsKeys.all, "detail"] as const,
  detail: (id: string) => [...commentsKeys.details(), id] as const,
};

// ==================== API FUNCTIONS (using Axios) ====================

// Fetch all comments
async function fetchComments(
  params?: QueryParams
): Promise<ApiResponse<Comment[]>> {
  const { data } = await apiClient.get<ApiResponse<Comment[]>>("/comments", {
    params,
  });
  return data;
}

// Fetch comments by post ID
async function fetchCommentsByPost(
  postId: string,
  params?: QueryParams
): Promise<ApiResponse<Comment[]>> {
  const { data } = await apiClient.get<ApiResponse<Comment[]>>(
    `/comments?postId=${postId}`,
    { params }
  );
  return data;
}

// Fetch single comment
async function getComment(id: string): Promise<ApiResponse<Comment>> {
  const { data } = await apiClient.get<ApiResponse<Comment>>(`/comments/${id}`);
  return data;
}

// Create comment
async function createComment(
  commentData: CreateCommentInput
): Promise<ApiResponse<Comment>> {
  const { data } = await apiClient.post<ApiResponse<Comment>>(
    "/comments",
    commentData
  );
  return data;
}

// Update comment
async function updateComment({
  id,
  data: commentData,
}: {
  id: string;
  data: UpdateCommentInput;
}): Promise<ApiResponse<Comment>> {
  const { data } = await apiClient.patch<ApiResponse<Comment>>(
    `/comments/${id}`,
    commentData
  );
  return data;
}

// Delete comment
async function deleteComment(id: string): Promise<ApiResponse<null>> {
  const { data } = await apiClient.delete<ApiResponse<null>>(`/comments/${id}`);
  return data;
}

// ==================== REACT QUERY HOOKS ====================

// Hook: Fetch all comments
export function useComments(params?: QueryParams) {
  return useQuery({
    queryKey: commentsKeys.list(params),
    queryFn: () => fetchComments(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook: Fetch comments by post ID
export function useCommentsByPost(postId: string) {
  return useQuery({
    queryKey: commentsKeys.byPost(postId),
    queryFn: () => fetchCommentsByPost(postId),
    enabled: !!postId && postId.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes - comments stay cached
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook: Fetch single comment
export function useComment(id: string) {
  return useQuery({
    queryKey: commentsKeys.detail(id),
    queryFn: () => getComment(id),
    enabled: !!id && id.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook: Create comment with optimistic updates
export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createComment,
    onMutate: async (newComment) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: commentsKeys.lists() });
      if (newComment.postId) {
        await queryClient.cancelQueries({
          queryKey: commentsKeys.byPost(newComment.postId),
        });
      }

      // Snapshot previous value for rollback
      const previousComments = queryClient.getQueryData(commentsKeys.lists());
      const previousPostComments = newComment.postId
        ? queryClient.getQueryData(commentsKeys.byPost(newComment.postId))
        : null;

      // Optimistically update to show new comment immediately
      queryClient.setQueryData(
        commentsKeys.lists(),
        (old: ApiResponse<Comment[]> | undefined) => {
          if (!old?.data) return old;

          // Create temporary comment with negative ID
          const optimisticComment: Comment = {
            id: `temp-${Date.now()}`,
            ...newComment,
            authorId: newComment.authorId || null,
            postId: newComment.postId || null,
            parentId: newComment.parentId || null,
            createdAt: new Date(),
            updatedAt: null,
            deletedAt: null,
          };

          return {
            ...old,
            data: [optimisticComment, ...old.data],
          };
        }
      );

      // Also update post-specific comments
      if (newComment.postId) {
        queryClient.setQueryData(
          commentsKeys.byPost(newComment.postId),
          (old: ApiResponse<Comment[]> | undefined) => {
            if (!old?.data) return old;

            const optimisticComment: Comment = {
              id: `temp-${Date.now()}`,
              ...newComment,
              authorId: newComment.authorId || null,
              postId: newComment.postId || null,
              parentId: newComment.parentId || null,
              createdAt: new Date(),
              updatedAt: null,
              deletedAt: null,
            };

            return {
              ...old,
              data: [optimisticComment, ...old.data],
            };
          }
        );
      }

      return { previousComments, previousPostComments, postId: newComment.postId };
    },
    onSuccess: (response, variables) => {
      // Invalidate and refetch comments list with new data
      queryClient.invalidateQueries({ queryKey: commentsKeys.lists() });
      if (variables.postId) {
        queryClient.invalidateQueries({
          queryKey: commentsKeys.byPost(variables.postId),
        });
      }

      Toast({
        title: "Comment created successfully",
        description: response.message,
        color: "success",
      });
    },
    onError: (error: Error, variables, context) => {
      // Rollback to previous state on error
      if (context?.previousComments) {
        queryClient.setQueryData(commentsKeys.lists(), context.previousComments);
      }
      if (context?.previousPostComments && context?.postId) {
        queryClient.setQueryData(
          commentsKeys.byPost(context.postId),
          context.previousPostComments
        );
      }

      Toast({
        title: "Failed to create comment",
        description: error.message,
        color: "danger",
      });
    },
  });
}

// Hook: Update comment with optimistic updates
export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateComment,
    onMutate: async ({ id, data: updateData }) => {
      // Cancel queries
      await queryClient.cancelQueries({ queryKey: commentsKeys.detail(id) });
      await queryClient.cancelQueries({ queryKey: commentsKeys.lists() });

      // Snapshot previous values
      const previousComment = queryClient.getQueryData(commentsKeys.detail(id));
      const previousComments = queryClient.getQueryData(commentsKeys.lists());

      // Optimistically update single comment
      queryClient.setQueryData(
        commentsKeys.detail(id),
        (old: ApiResponse<Comment> | undefined) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: { ...old.data, ...updateData },
          };
        }
      );

      // Optimistically update in list
      queryClient.setQueryData(
        commentsKeys.lists(),
        (old: ApiResponse<Comment[]> | undefined) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.map((comment) =>
              comment.id.toString() === id.toString() ? { ...comment, ...updateData } : comment
            ),
          };
        }
      );

      return { previousComment, previousComments, id };
    },
    onSuccess: (response, variables) => {
      // Invalidate specific comment and lists
      queryClient.invalidateQueries({
        queryKey: commentsKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: commentsKeys.lists() });

      Toast({
        title: "Comment updated successfully",
        description: response.message,
        color: "success",
      });
    },
    onError: (error: Error, _variables, context) => {
      // Rollback optimistic updates
      if (context?.previousComment) {
        queryClient.setQueryData(
          commentsKeys.detail(context.id),
          context.previousComment
        );
      }
      if (context?.previousComments) {
        queryClient.setQueryData(commentsKeys.lists(), context.previousComments);
      }

      Toast({
        title: "Failed to update comment",
        description: error.message,
        color: "danger",
      });
    },
  });
}

// Hook: Delete comment with optimistic removal
export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteComment,
    onMutate: async (id) => {
      // Cancel queries
      await queryClient.cancelQueries({ queryKey: commentsKeys.lists() });

      // Snapshot previous value
      const previousComments = queryClient.getQueryData(commentsKeys.lists());

      // Optimistically remove from list
      queryClient.setQueryData(
        commentsKeys.lists(),
        (old: ApiResponse<Comment[]> | undefined) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.filter((comment) => comment.id.toString() !== id.toString()),
          };
        }
      );

      return { previousComments, id };
    },
    onSuccess: (response) => {
      // Invalidate comments list
      queryClient.invalidateQueries({ queryKey: commentsKeys.lists() });

      Toast({
        title: "Comment deleted successfully",
        description: response.message,
        color: "success",
      });
    },
    onError: (error: Error, _id, context) => {
      // Rollback on error
      if (context?.previousComments) {
        queryClient.setQueryData(commentsKeys.lists(), context.previousComments);
      }

      Toast({
        title: "Failed to delete comment",
        description: error.message,
        color: "danger",
      });
    },
  });
}

// ==================== UTILITIES ====================

// Export for use with optimistic updates
export function getOptimisticComment(input: CreateCommentInput): Comment {
  return {
    id: `temp-${Date.now()}`,
    ...input,
    authorId: input.authorId || null,
    postId: input.postId || null,
    parentId: input.parentId || null,
    createdAt: new Date(),
    updatedAt: null,
    deletedAt: null,
  };
}
