"use client";

import { useState, useCallback, useEffect } from "react";
import axios from "axios";

export interface SearchResult {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  createdAt: string;
  label: string | null;
  type: string | null;
  author: string | null;
}

export interface AISuggestion {
  title: string;
  reason: string;
}

export interface SearchResponse {
  success: boolean;
  data: {
    results: SearchResult[];
    suggestions: AISuggestion[];
    totalResults: number;
  };
  message: string;
}

interface UseSearchOptions {
  debounceMs?: number;
}

/**
 * Custom hook for AI-powered search with keyboard shortcut support
 * Features:
 * - Debounced search queries
 * - AI-powered suggestions
 * - Keyboard shortcut support (Ctrl+K / Cmd+K)
 * - Loading and error states
 *
 * Note: Uses SearchProvider context for isOpen state
 * This hook manages search results and keyboard listeners
 */
export function useSearch(options: UseSearchOptions = {}) {
  const { debounceMs = 300 } = options;

  // Note: isOpen and setIsOpen are managed by SearchProvider context
  // This hook only manages search results and side effects
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);

  // Handle search API call with debouncing
  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        setSuggestions([]);
        setTotalResults(0);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.post<SearchResponse>("/api/ai/search", {
          query: searchQuery,
        });

        if (response.data.success) {
          setResults(response.data.data.results);
          setSuggestions(response.data.data.suggestions);
          setTotalResults(response.data.data.totalResults);
        } else {
          setError(response.data.message || "Search failed");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        console.error("Search error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Debounced search handler
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        performSearch(query);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs, performSearch]);

  // Note: Keyboard shortcuts (Ctrl+K, Escape) are now handled by SearchProvider context
  // This hook only handles search logic and API calls

  // Handle search input change
  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery);
  }, []);

  return {
    // State
    query,
    results,
    suggestions,
    isLoading,
    error,
    totalResults,

    // Methods
    handleQueryChange,
    performSearch,
  };
}
