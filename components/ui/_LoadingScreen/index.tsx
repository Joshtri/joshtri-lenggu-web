"use client";

import { Loader2 } from "lucide-react";

interface LoadingScreenProps {
  /**
   * Controls the visibility of the loading screen
   */
  isLoading: boolean;
  /**
   * Optional loading message to display
   * @default "Loading..."
   */
  message?: string;
  /**
   * Optional fullscreen mode
   * @default true
   */
  fullscreen?: boolean;
  /**
   * Optional spinner size
   * @default "large"
   */
  size?: "small" | "medium" | "large";
  /**
   * Optional blur backdrop
   * @default true
   */
  blur?: boolean;
}

export function LoadingScreen({
  isLoading,
  message = "Loading...",
  fullscreen = true,
  size = "large",
  blur = true,
}: LoadingScreenProps) {
  if (!isLoading) return null;

  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-12 h-12",
    large: "w-16 h-16",
  };

  return (
    <div
      className={`
        ${fullscreen ? "fixed inset-0" : "absolute inset-0"}
        z-[9999] flex items-center justify-center
        ${blur ? "backdrop-blur-sm" : ""}
        bg-white/80 dark:bg-gray-900/80
        transition-opacity duration-300
      `}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="flex flex-col items-center gap-4 p-8">
        {/* Animated Spinner */}
        <div className="relative">
          {/* Outer ring */}
          <div
            className={`
              ${sizeClasses[size]}
              rounded-full border-4 border-gray-200 dark:border-gray-700
            `}
          />
          {/* Spinning ring */}
          <Loader2
            className={`
              ${sizeClasses[size]}
              absolute top-0 left-0
              text-blue-600 dark:text-blue-400
              animate-spin
            `}
            strokeWidth={3}
          />
        </div>

        {/* Loading Message */}
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {message}
          </p>
          {/* Animated dots */}
          <div className="flex items-center justify-center gap-1">
            <span
              className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"
              style={{ animationDelay: "0ms" }}
            />
            <span
              className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"
              style={{ animationDelay: "150ms" }}
            />
            <span
              className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Minimal loading spinner (inline use)
 */
interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  className?: string;
}

export function LoadingSpinner({
  size = "medium",
  className = "",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-6 h-6",
    large: "w-8 h-8",
  };

  return (
    <Loader2
      className={`${sizeClasses[size]} text-blue-600 animate-spin ${className}`}
      strokeWidth={2.5}
    />
  );
}

/**
 * Loading skeleton for content placeholders
 */
interface LoadingSkeletonProps {
  /**
   * Number of lines to show
   * @default 3
   */
  lines?: number;
  /**
   * Height of each line
   * @default "h-4"
   */
  lineHeight?: string;
  /**
   * Show avatar/circle skeleton
   * @default false
   */
  avatar?: boolean;
  className?: string;
}

export function LoadingSkeleton({
  lines = 3,
  lineHeight = "h-4",
  avatar = false,
  className = "",
}: LoadingSkeletonProps) {
  return (
    <div className={`animate-pulse ${className}`}>
      {avatar && (
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/6" />
          </div>
        </div>
      )}
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${lineHeight} bg-gray-200 dark:bg-gray-700 rounded ${
              index === lines - 1 ? "w-5/6" : "w-full"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Card skeleton for dashboard/list items
 */
interface CardSkeletonProps {
  /**
   * Number of cards to show
   * @default 1
   */
  count?: number;
  className?: string;
}

export function CardSkeleton({ count = 1, className = "" }: CardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`bg-white rounded-lg border border-gray-200 p-6 shadow-sm ${className}`}
        >
          <div className="animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-8 bg-gray-200 rounded w-1/2" />
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-lg" />
            </div>
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>
        </div>
      ))}
    </>
  );
}

/**
 * Table skeleton for data tables
 */
interface TableSkeletonProps {
  /**
   * Number of rows to show
   * @default 5
   */
  rows?: number;
  /**
   * Number of columns to show
   * @default 4
   */
  columns?: number;
}

export function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Table Header */}
      <div className="border-b border-gray-200 bg-gray-50 p-4">
        <div className="grid gap-4 animate-pulse" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded w-3/4" />
          ))}
        </div>
      </div>
      {/* Table Body */}
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="p-4">
            <div className="grid gap-4 animate-pulse" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div
                  key={colIndex}
                  className={`h-4 bg-gray-200 rounded ${
                    colIndex === 0 ? "w-full" : "w-3/4"
                  }`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
