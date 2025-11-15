"use client";

import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";

interface GenerateTextRequest {
    prompt: string;
}

interface GenerateTextResponse {
    text: string;
}

async function generateText(request: GenerateTextRequest): Promise<GenerateTextResponse> {
    const { data } = await apiClient.post('/ai/generate', request);
    return data.data;
}

export function useGenerateText() {
    return useMutation({
        mutationFn: generateText,
    });
}