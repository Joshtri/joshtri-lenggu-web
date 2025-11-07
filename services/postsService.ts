"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { toast } from "@heroui/react";
import { apiClient } from "@/lib/axios";

import { ApiResponse, QueryParams } from "@/interfaces/api";
import { CreatePostInput, Post, UpdatePostInput } from "@/components/features/posts/interfaces/posts";
import { Toast } from "@/components/ui/Toast";
// import type {
//   Post,
//   CreatePostInput,
//   UpdatePostInput,
//   QueryParams,
//   ApiResponse,
// } from "@/interfaces/post.types";

// Query keys
export const postsKeys = {
  all: ["posts"] as const,
  lists: () => [...postsKeys.all, "list"] as const,
  list: (params?: QueryParams) =>
    [...postsKeys.lists(), params] as const,
  details: () => [...postsKeys.all, "detail"] as const,
  detail: (id: number) => [...postsKeys.details(), id] as const,
};

// ==================== API FUNCTIONS (using Axios) ====================

// Fetch all posts
async function fetchPosts(
  params?: QueryParams
): Promise<ApiResponse<Post[]>> {
  const { data } = await apiClient.get<ApiResponse<Post[]>>("/posts", {
    params,
  });
  return data;
}

// Fetch single post
async function getPost(id: string | number): Promise<ApiResponse<Post>> {
  const { data } = await apiClient.get<ApiResponse<Post>>(`/posts/${id}`);
  return data;
}

// Create post
async function createPost(
  postData: CreatePostInput
): Promise<ApiResponse<Post>> {
  const { data } = await apiClient.post<ApiResponse<Post>>("/posts", postData);
  return data;
}

// Update post
async function updatePost({
  id,
  data: postData,
}: {
  id: string | number;
  data: UpdatePostInput;
}): Promise<ApiResponse<Post>> {
  const { data } = await apiClient.patch<ApiResponse<Post>>(
    `/posts/${id}`,
    postData
  );
  return data;
}

// Delete post
async function deletePost(id: string | number): Promise<ApiResponse<null>> {
  const { data } = await apiClient.delete<ApiResponse<null>>(`/posts/${id}`);
  return data;
}

// ==================== REACT 19.2 HOOKS ====================

// Hook: Fetch all posts with optimistic UI
export function usePosts(params?: QueryParams) {
  return useQuery({
    queryKey: postsKeys.list(params),
    queryFn: () => fetchPosts(params),
    staleTime: 5000, // Consider data fresh for 5 seconds
    gcTime: 10 * 60 * 1000, // Cache for 10 minutes (formerly cacheTime)
  });
}

// Hook: Fetch single post
export function usePost(id: string | number) {
  return useQuery({
    queryKey: postsKeys.detail(id as number),
    queryFn: () => getPost(id),
    enabled: !!id,
    staleTime: 5000,
  });
}

// Hook: Create post with React 19.2 optimizations
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onMutate: async (newPost) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: postsKeys.lists() });

      // Snapshot previous value for rollback
      const previousPosts = queryClient.getQueryData(postsKeys.lists());

      // Optimistically update to show new post immediately
      queryClient.setQueryData(
        postsKeys.lists(),
        (old: ApiResponse<Post[]> | undefined) => {
          if (!old?.data) return old;

          // Create temporary post with negative ID
          const optimisticPost: Post = {
            id: -Date.now(), // Temporary negative ID
            ...newPost,
            authorId: newPost.authorId || null,
            labelId: newPost.labelId || null,
            createdAt: new Date(),
            updatedAt: null,
            deletedAt: null,
          };

          return {
            ...old,
            data: [optimisticPost, ...old.data],
          };
        }
      );

      return { previousPosts };
    },
    onSuccess: (response) => {
      // Invalidate and refetch posts list with new data
      queryClient.invalidateQueries({ queryKey: postsKeys.lists() });

      // Show success 
      Toast({
        title: "Post created successfully",
        description: response.message,
        color: "success"

      })
    },
    onError: (error: Error, _newPost, context) => {
      // Rollback to previous state on error
      if (context?.previousPosts) {
        queryClient.setQueryData(postsKeys.lists(), context.previousPosts);
      }

      Toast({
        title: "Failed to create post",
        description: error.message,
        color: "danger",
       
      })
    },
  });
}

// Hook: Update post with optimistic updates
export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePost,
    onMutate: async ({ id, data: updateData }) => {
      // Cancel queries
      await queryClient.cancelQueries({ queryKey: postsKeys.detail(id) });
      await queryClient.cancelQueries({ queryKey: postsKeys.lists() });

      // Snapshot previous values
      const previousPost = queryClient.getQueryData(postsKeys.detail(id));
      const previousPosts = queryClient.getQueryData(postsKeys.lists());

      // Optimistically update single post
      queryClient.setQueryData(
        postsKeys.detail(id),
        (old: ApiResponse<Post> | undefined) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: { ...old.data, ...updateData },
          };
        }
      );

      // Optimistically update in list
      queryClient.setQueryData(
        postsKeys.lists(),
        (old: ApiResponse<Post[]> | undefined) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.map((post) =>
              post.id === id ? { ...post, ...updateData } : post
            ),
          };
        }
      );

      return { previousPost, previousPosts, id };
    },
    onSuccess: (response, variables) => {
      // Invalidate specific post and lists
      queryClient.invalidateQueries({ queryKey: postsKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: postsKeys.lists() });

      Toast({
        title: "Post updated successfully",
        description: response.message,
        color: "success"
      })
    },
    onError: (error: Error, _variables, context) => {
      // Rollback optimistic updates
      if (context?.previousPost) {
        queryClient.setQueryData(
          postsKeys.detail(context.id),
          context.previousPost
        );
      }
      if (context?.previousPosts) {
        queryClient.setQueryData(postsKeys.lists(), context.previousPosts);
      }

      Toast({
        title: "Failed to update post",
        description: error.message,
        color: "danger",
      })
    },
  });
}

// Hook: Delete post with optimistic removal
export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,
    onMutate: async (id) => {
      // Cancel queries
      await queryClient.cancelQueries({ queryKey: postsKeys.lists() });

      // Snapshot previous value
      const previousPosts = queryClient.getQueryData(postsKeys.lists());

      // Optimistically remove from list
      queryClient.setQueryData(
        postsKeys.lists(),
        (old: ApiResponse<Post[]> | undefined) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.filter((post) => post.id !== id),
          };
        }
      );

      return { previousPosts, id };
    },
    onSuccess: (response) => {
      // Invalidate posts list
      queryClient.invalidateQueries({ queryKey: postsKeys.lists() });

      Toast({
        title: "Post deleted successfully",
        description: response.message,
        color: "success"
      })

    },
    onError: (error: Error, _id, context) => {
      // Rollback on error
      if (context?.previousPosts) {
        queryClient.setQueryData(postsKeys.lists(), context.previousPosts);
      }

      
      Toast({
        title: "Failed to delete post",
        description: error.message,
        color: "danger",

      })
    },
  });
}

// ==================== REACT 19.2 UTILITIES ====================

// Export for use with React 19.2 useOptimistic hook
export function getOptimisticPost(input: CreatePostInput): Post {
  return {
    id: -Date.now(),
    ...input,
    authorId: input.authorId || null,
    labelId: input.labelId || null,
    createdAt: new Date(),
    updatedAt: null,
    deletedAt: null,
  };
}
