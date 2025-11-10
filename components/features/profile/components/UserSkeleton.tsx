import React from "react";

interface UserSkeletonProps {
  /**
   * Tampilkan bagian teks (nama / email). Default: true
   */
  showText?: boolean;
  /**
   * Tambahan className pada wrapper
   */
  className?: string;
}

export default function UserSkeleton({
  showText = true,
  className = "",
}: UserSkeletonProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {showText && (
        <div className="hidden sm:block text-right space-y-1">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
      )}
      <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
    </div>
  );
}
