"use client";

import { useEffect } from "react";
import { useRecordPostView } from "@/services/postViewsService";

interface PostViewTrackerProps {
  slug: string;
  enabled?: boolean;
  delay?: number; // Delay in milliseconds before recording view (default: 1000ms)
}

/**
 * Client component to automatically track post views
 * Drop this component into any post detail page to track views
 * 
 * @example
 * <PostViewTracker slug={post.slug} />
 */
export function PostViewTracker({ 
  slug, 
  enabled = true, 
  delay = 1000 
}: PostViewTrackerProps) {
  const { mutate } = useRecordPostView();

  useEffect(() => {
    if (!enabled || !slug) return;

    // Wait before recording to ensure it's a real visit
    const timer = setTimeout(() => {
      mutate(slug);
    }, delay);

    return () => clearTimeout(timer);
  }, [slug, enabled, delay, mutate]);

  // This component renders nothing
  return null;
}
