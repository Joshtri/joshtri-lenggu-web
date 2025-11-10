"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { toast } from "@heroui/react";
import { apiClient } from "@/lib/axios";
import { ApiResponse, QueryParams } from "@/interfaces/api";
import { CreateLabelInput, Label, UpdateLabelInput } from "@/components/features/labels/interfaces/labels";
import { Toast } from "@/components/ui/Toast";




export const labelsKeys = {
    all: ["labels"] as const,
    lists: () => [...labelsKeys.all, "list"] as const,
    list: (params?: QueryParams) =>
        [...labelsKeys.lists(), params] as const,
    details: () => [...labelsKeys.all, "detail"] as const,
    detail: (id: string) => [...labelsKeys.details(), id] as const,
};


// ==================== API FUNCTIONS (using Axios) ====================

// Fetch all posts
async function getLabels(
    params?: QueryParams
): Promise<ApiResponse<Label[]>> {
    const { data } = await apiClient.get<ApiResponse<Label[]>>("/labels", {
        params,
    });
    return data;
}

// Fetch single post
async function getLabel(id: string): Promise<ApiResponse<Label>> {
    const { data } = await apiClient.get<ApiResponse<Label>>(`/labels/${id}`);
    return data;
}

// Create post
async function createLabel(
    labelData: CreateLabelInput
): Promise<ApiResponse<Label>> {
    const { data } = await apiClient.post<ApiResponse<Label>>("/labels", labelData);
    return data;
}

// Update label
async function updateLabel({
    id,
    data: labelData,
}: {
    id: string;
    data: UpdateLabelInput;
}): Promise<ApiResponse<Label>> {
    const { data } = await apiClient.patch<ApiResponse<Label>>(
        `/labels/${id}`,
        labelData
    );
    return data;
}

// Delete label
async function deleteLabel(id: string): Promise<ApiResponse<null>> {
    const { data } = await apiClient.delete<ApiResponse<null>>(`/labels/${id}`);
    return data;
}



export function useLabels(params?: QueryParams) {
    return useQuery({
        queryKey: labelsKeys.list(params),
        queryFn: () => getLabels(params),
        staleTime: 5000, // Consider data fresh for 5 seconds
        gcTime: 10 * 60 * 1000, // Cache for 10 minutes (formerly cacheTime)
    })

}


export function useLabel(id: string) {
    return useQuery({
        queryKey: labelsKeys.detail(id),
        queryFn: () => getLabel(id),
        staleTime: 5000, // Consider data fresh for 5 seconds
        gcTime: 10 * 60 * 1000, // Cache for 10 minutes (formerly cacheTime))
    })
}



// ==================== REACT 19.2 UTILITIES ====================

// Export for use with React 19.2 useOptimistic hook
export function getOptimisticLabel(input: CreateLabelInput): Label {
    return {
        id: (-Date.now()).toString(),
        name: input.name,
        color: input.color,
        description: input.description ?? null,
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
    };
}

// Hook: Create label with React 19.2 optimizations
export function useCreateLabel() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createLabel,
        onMutate: async (newLabel) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: labelsKeys.lists() });

            // Snapshot previous value for rollback
            const previousLabels = queryClient.getQueryData(labelsKeys.lists());

            // Optimistically update to show new label immediately
            queryClient.setQueryData(
                labelsKeys.lists(),
                (old: ApiResponse<Label[]> | undefined) => {
                    if (!old?.data) return old;

                    // Create temporary label with negative ID
                    const optimisticLabel: Label = getOptimisticLabel(newLabel);

                    return {
                        ...old,
                        data: [optimisticLabel, ...old.data],
                    };
                }
            );

            return { previousLabels };
        },
        onSuccess: (response) => {
            // Invalidate and refetch posts list with new data
            queryClient.invalidateQueries({ queryKey: labelsKeys.lists() });

            // Show success 
            Toast({
                title: "Label created successfully",
                description: response.message,
                color: "success"

            })
        },
        onError: (error: Error, _newPost, context) => {
            // Rollback to previous state on error
            if (context?.previousLabels) {
                queryClient.setQueryData(labelsKeys.lists(), context.previousLabels);
            }

            Toast({
                title: "Failed to create label",
                description: error.message,
                color: "danger",

            })
        },
    });
}


// Hook: Update label with optimistic updates
export function useUpdateLabel() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateLabel,
        onMutate: async ({ id, data: updateData }) => {
            await queryClient.cancelQueries({ queryKey: labelsKeys.detail(id) });
            await queryClient.cancelQueries({ queryKey: labelsKeys.lists() });

            const previousLabel = queryClient.getQueryData(labelsKeys.detail(id));
            const previousLabels = queryClient.getQueryData(labelsKeys.lists());

            // Optimistically update single label cache
            queryClient.setQueryData(
                labelsKeys.detail(id),
                (old: ApiResponse<Label> | undefined) => {
                    if (!old?.data) return old;
                    return {
                        ...old,
                        data: { ...old.data, ...updateData },
                    };
                }
            );

            // Optimistically update label within list cache
            queryClient.setQueryData(
                labelsKeys.lists(),
                (old: ApiResponse<Label[]> | undefined) => {
                    if (!old?.data) return old;
                    return {
                        ...old,
                        data: old.data.map((label) =>
                            label.id === id ? { ...label, ...updateData } : label
                        ),
                    };
                }
            );

            return { previousLabel, previousLabels, id };
        },
        onSuccess: (response, variables) => {
            // Ensure fresh data
            queryClient.invalidateQueries({ queryKey: labelsKeys.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: labelsKeys.lists() });

            Toast({
                title: "Label updated successfully",
                description: response.message,
                color: "success"
            })
        },
        onError: (error: Error, _variables, context) => {
            // Rollback optimistic updates
            if (context?.previousLabel) {
                queryClient.setQueryData(
                    labelsKeys.detail(context.id),
                    context.previousLabel
                );
            }
            if (context?.previousLabels) {
                queryClient.setQueryData(labelsKeys.lists(), context.previousLabels);
            }

            Toast({
                title: "Failed to update label",
                description: error.message,
                color: "danger",
            })
        },
    });
}

// Hook: Delete label with optimistic removal
export function useDeleteLabel() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteLabel,
        onMutate: async (id: string) => {
            await queryClient.cancelQueries({ queryKey: labelsKeys.lists() });

            const previousLabels = queryClient.getQueryData(labelsKeys.lists());

            queryClient.setQueryData(
                labelsKeys.lists(),
                (old: ApiResponse<Label[]> | undefined) => {
                    if (!old?.data) return old;
                    return {
                        ...old,
                        data: old.data.filter((label) => label.id !== id),
                    };
                }
            );

            return { previousLabels };
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: labelsKeys.lists() });

            Toast({
                title: "Label deleted successfully",
                description: response.message,
                color: "success"
            })
        },
        onError: (error: Error, _id, context) => {
            if (context?.previousLabels) {
                queryClient.setQueryData(labelsKeys.lists(), context.previousLabels);
            }

            Toast({
                title: "Failed to delete label",
                description: error.message,
                color: "danger",
            })
        },
    });
}
