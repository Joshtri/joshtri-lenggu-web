"use client";

import React, { useEffect, useRef } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Input,
  Button,
  Spinner,
  Divider,
} from "@heroui/react";
import { Search, X, Lightbulb, ArrowRight } from "lucide-react";
import { useSearchContext } from "@/providers/SearchProvider";
import { useSearch } from "@/hooks/useSearch";
import Link from "next/link";

/**
 * SearchModal Component
 * Provides AI-powered search with suggestions
 * Opens via Ctrl+K (Windows) / Cmd+K (Mac)
 */
export function SearchModal() {
  // Get shared state from context
  const { isOpen, setIsOpen, handleQueryChange, handleClose } =
    useSearchContext();

  // Get search results from hook
  const { query, results, suggestions, isLoading, error, totalResults } =
    useSearch();

  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  const handleSuggestionClick = (suggestion: string) => {
    handleQueryChange(suggestion);
  };

  const handleModalOpenChange = (open: boolean) => {
    if (!open) {
      handleClose();
    } else {
      setIsOpen(true);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={handleModalOpenChange}
      size="2xl"
      backdrop="opaque"
      className="rounded-xl"
      classNames={{
        backdrop: "bg-black/50",
      }}
      hideCloseButton
      scrollBehavior="inside"
    >
      <ModalContent className="max-h-[80vh] dark:bg-slate-950 bg-white">
        {/* Header with close button */}
        <ModalHeader className="flex items-center justify-between border-b dark:border-slate-800 border-slate-200">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-slate-500" />
            <span className="text-lg font-semibold">Search Articles</span>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </ModalHeader>

        <ModalBody className="flex flex-col gap-4 py-4">
          {/* Search Input */}
          <div className="sticky top-0 bg-white dark:bg-slate-950 z-10 pb-2">
            <Input
              ref={inputRef}
              isClearable
              isDisabled={isLoading}
              className="w-full"
              placeholder="Search articles, topics, labels..."
              startContent={
                isLoading ? (
                  <Spinner size="sm" />
                ) : (
                  <Search className="w-5 h-5 text-slate-400" />
                )
              }
              value={query}
              onValueChange={handleQueryChange}
              onClear={() => handleQueryChange("")}
              classNames={{
                input: "text-base",
                inputWrapper:
                  "dark:bg-slate-900 bg-slate-100 border dark:border-slate-800 border-slate-200",
              }}
            />
            <p className="text-xs text-slate-500 mt-2">
              Press{" "}
              <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded text-xs font-mono">
                Esc
              </kbd>{" "}
              to close
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 text-sm">
              <p className="font-semibold">Error</p>
              <p>{error}</p>
            </div>
          )}

          {/* Loading State */}
          {isLoading && query && (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
              <Spinner size="lg" color="primary" />
              <p className="text-slate-600 dark:text-slate-400">
                Searching and generating suggestions...
              </p>
            </div>
          )}

          {/* No query state */}
          {!query && !isLoading && (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              <p className="text-sm">
                Start typing to search articles and get AI suggestions
              </p>
            </div>
          )}

          {/* Results Section */}
          {query && !isLoading && (
            <>
              {/* AI Suggestions */}
              {suggestions.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    AI Suggestions
                  </div>
                  <div className="grid gap-2">
                    {suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(suggestion.title)}
                        className="text-left p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border dark:border-slate-800 border-slate-200"
                      >
                        <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                          {suggestion.title}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                          {suggestion.reason}
                        </p>
                      </button>
                    ))}
                  </div>
                  {results.length > 0 && <Divider className="my-4" />}
                </div>
              )}

              {/* Search Results */}
              {results.length > 0 && (
                <div className="space-y-3">
                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Articles ({totalResults})
                  </div>
                  <div className="grid gap-3">
                    {results.map((result) => (
                      <Link
                        key={result.id}
                        href={`/${result.type?.toLowerCase() || "blog"}/${
                          result.slug
                        }`}
                        onClick={handleClose}
                      >
                        <div className="group p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border dark:border-slate-800 border-slate-200 cursor-pointer">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                                {result.title}
                                {result.type && (
                                  <span className="text-sm font-normal text-slate-600 dark:text-slate-400 ml-2">
                                    - {result.type}
                                  </span>
                                )}
                              </h3>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                                {result.excerpt}
                              </p>
                              {result.label && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  <span className="inline-block px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded">
                                    {result.label}
                                  </span>
                                </div>
                              )}
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex-shrink-0 mt-1 transition-colors" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* No results state */}
              {results.length === 0 && suggestions.length === 0 && (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  <p className="text-sm">No articles found for “{query}”</p>
                  <p className="text-xs mt-2">
                    Try different keywords or check our categories
                  </p>
                </div>
              )}
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
