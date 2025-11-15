"use client";

import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { useState } from "react";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import EmptyState from "@/components/ui/Common/EmptyState";
import { formatPostDate } from "@/utils/formatDate";
import CategoryHeader from "./CategoryHeader";
import { Post } from "../posts/interfaces/posts";
import { Type } from "../types/interfaces";
import ShareDropdown from "@/components/ui/ShareDropdown";
import { CategorySearchModal } from "../search/CategorySearchModal";
import AISummaryButton from "./AISummaryButton";
import { Button, Card, CardBody, CardFooter } from "@heroui/react";

// interface Type {
//   id: string;
//   name: string;
//   description: string | null;
// }


interface CategoryViewProps {
  type: Type;
  posts: Post[];
  slug: string;
}

export default function CategoryView({ type, posts, slug }: CategoryViewProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const getPostUrl = (postSlug: string) => {
    return typeof window !== 'undefined'
      ? `${window.location.origin}/${slug}/${postSlug}`
      : `/${slug}/${postSlug}`;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Category Search Modal */}
      <CategorySearchModal
        typeId={type.id}
        typeName={type.name}
        isOpen={isSearchOpen}
        onOpenChange={setIsSearchOpen}
      />

      {/* Header Section */}
      <CategoryHeader
        type={type}
        slug={slug}
        postsCount={posts.length}
        onSearchClick={() => setIsSearchOpen(true)}
      />

      {/* Posts Grid Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {posts.length === 0 ? (
          <EmptyState
            title={"No articles yet in this category"}
            description={"Stay tuned for more articles in this category."}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Card key={post.id} className="group relative h-full   dark:border-gray-700 rounded-lg overflow-hidden hover:border-gray-900 dark:hover:border-gray-400 transition-all duration-300 flex flex-col bg-white dark:bg-gray-900">
                {/* Cover Image */}
                {post.coverImage && (
                  <Link href={`/${slug}/${post.slug}`}>
                    <div className="relative w-full h-48 overflow-hidden bg-gray-200 dark:bg-gray-800 cursor-pointer">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>
                )}

                {/* Content */}
                <CardBody className="flex-1 flex flex-col p-6">
                  <Link href={`/${slug}/${post.slug}`}>
                    <Heading className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer">
                      {post.title}
                    </Heading>
                  </Link>

                  <Text className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 flex-grow font-light">
                    {post.excerpt}
                  </Text>

                  {/* Footer */}
                  <CardFooter  className="flex items-center justify-between pt-4 border-t-2 border-dashed border-gray-200 dark:border-gray-700">
                    {post.createdAt && (
                      <Text className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wider">
                        {formatPostDate(post.createdAt)}
                      </Text>
                    )}
                    <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                      {/* <AISummaryButton
                        title={post.title}
                        excerpt={post.excerpt}
                        content={post.content}
                      /> */}
                      <Button as={Link} isIconOnly variant="light" size="sm"  href={`/${slug}/${post.slug}`} className="flex items-center gap-1 transition-colors cursor-pointer">
                        <BookOpen className="h-4 w-4" />
                      </Button>
                      <ShareDropdown
                        title={post.title}
                        url={getPostUrl(post.slug)}
                      />
                    </div>
                  </CardFooter>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
