"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@heroui/react";
import { ArrowLeft, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { BookHeart, Code2, Zap, Palette } from "lucide-react";

interface Type {
  id: string;
  name: string;
  description: string | null;
}

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  createdAt: Date | null;
}

interface CategoryViewProps {
  type: Type;
  posts: Post[];
  slug: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "personal-blog": BookHeart,
  "personal": BookHeart,
  "technology": Code2,
  "teknologi": Code2,
  "tutorial": Zap,
  "design": Palette,
};

export default function CategoryView({
  type,
  posts,
  slug,
}: CategoryViewProps) {
  const router = useRouter();
  const Icon = iconMap[slug] || BookHeart;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header Section */}
      <section className="border-b-2 border-dashed border-gray-300 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Button
            isIconOnly
            variant="light"
            onPress={() => router.back()}
            className="mb-6 dark:text-gray-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="flex items-start gap-6 mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-full">
              <Icon className="h-12 w-12 text-gray-900 dark:text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
                {type.name}
              </h1>
              {type.description && (
                <p className="text-xl text-gray-600 dark:text-gray-400 font-light">
                  {type.description}
                </p>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                {posts.length} article{posts.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Grid Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600 dark:text-gray-400 font-light">
              No articles yet in this category
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link key={post.id} href={`/${slug}/${post.slug}`}>
                <div className="group relative h-full border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden hover:border-gray-900 dark:hover:border-gray-400 transition-all duration-300 cursor-pointer flex flex-col bg-white dark:bg-gray-900">
                  {/* Cover Image */}
                  {post.coverImage && (
                    <div className="relative w-full h-48 overflow-hidden bg-gray-200 dark:bg-gray-800">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 flex flex-col p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 flex-grow font-light">
                      {post.excerpt}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t-2 border-dashed border-gray-200 dark:border-gray-700">
                      {post.createdAt && (
                        <span className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wider">
                          {new Date(post.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      )}
                      <div className="flex items-center gap-2 text-gray-900 dark:text-white group-hover:gap-3 transition-all">
                        <Eye className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
