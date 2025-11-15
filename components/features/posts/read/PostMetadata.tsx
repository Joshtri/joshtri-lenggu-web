"use client";

import { Calendar, Clock, Tag } from "lucide-react";
import Link from "next/link";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";

interface PostMetadataProps {
  type: {
    id: string;
    name: string;
  };
  slug: string;
  formattedDate: string;
  readingTime: number;
  tags?: string[];
}

export default function PostMetadata({
  type,
  slug,
  formattedDate,
  readingTime,
  tags = [],
}: PostMetadataProps) {
  return (
    <div className="sticky top-96 space-y-4 p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
      <Heading className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
        Post Info
      </Heading>

      {/* Category */}
      <div className="flex items-start gap-2">
        <Tag className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
        <div>
          <Text className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Category
          </Text>
          <Link
            href={`/${slug}`}
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            {type.name}
          </Link>
        </div>
      </div>

      {/* Date */}
      <div className="flex items-start gap-2">
        <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
        <div>
          <Text className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Published
          </Text>
          <Text className="text-sm font-medium text-gray-900 dark:text-white">
            {formattedDate}
          </Text>
        </div>
      </div>

      {/* Reading Time */}
      <div className="flex items-start gap-2">
        <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
        <div>
          <Text className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Reading Time
          </Text>
          <Text className="text-sm font-medium text-gray-900 dark:text-white">
            {readingTime} min read
          </Text>
        </div>
      </div>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <Text className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            Tags
          </Text>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
