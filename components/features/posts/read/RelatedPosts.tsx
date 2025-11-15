"use client";

import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import Link from "next/link";
import Image from "next/image";

interface RelatedPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
}

interface RelatedPostsProps {
  posts: RelatedPost[];
  categorySlug: string;
}

export default function RelatedPosts({ posts, categorySlug }: RelatedPostsProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <div className="sticky top-32 space-y-4">
      <Heading className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
        Related Posts
      </Heading>
      <div className="space-y-4">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/${categorySlug}/${post.slug}`}
            className="block group"
          >
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 hover:border-gray-900 dark:hover:border-gray-400 transition-all">
              {post.coverImage && (
                <div className="relative w-full h-32 mb-3 overflow-hidden rounded-md">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <Heading className="text-sm font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {post.title}
              </Heading>
              <Text className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                {post.excerpt}
              </Text>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
