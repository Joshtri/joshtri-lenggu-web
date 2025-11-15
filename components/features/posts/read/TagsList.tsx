"use client";

import { Heading } from "@/components/ui/Heading";
import { Tag } from "lucide-react";
import Link from "next/link";

interface TagsListProps {
  tags: string[];
}

export default function TagsList({ tags }: TagsListProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="sticky top-32 space-y-4">
      <Heading className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
        <Tag className="w-4 h-4" />
        Tags
      </Heading>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <Link
            key={index}
            href={`/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`}
            className="inline-flex items-center px-3 py-1.5 text-sm border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:border-gray-900 dark:hover:border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            #{tag}
          </Link>
        ))}
      </div>
    </div>
  );
}
