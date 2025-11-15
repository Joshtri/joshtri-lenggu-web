"use client";

import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { BreadcrumbItem, Breadcrumbs, Button } from "@heroui/react";
import { ArrowLeft, Calendar, Clock, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Type {
  id: string;
  name: string;
}

interface Post {
  title: string;
  excerpt: string;
}

interface PostReadHeaderProps {
  post: Post;
  type: Type;
  slug: string;
  formattedDate: string;
  readingTime: number;
  viewsCount?: number;
}

export default function PostReadHeader({
  post,
  type,
  slug,
  formattedDate,
  readingTime,
  viewsCount = 0,
}: PostReadHeaderProps) {
  const router = useRouter();

  return (
    <section className="bg-white dark:bg-gray-950 border-b-2 border-dashed border-gray-300 dark:border-gray-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-4 mb-4">
          <Button
            isIconOnly
            variant="light"
            onPress={() => router.back()}
            className="text-gray-900 dark:text-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Breadcrumbs
            separator={
              <span className="mx-2 text-gray-500 dark:text-gray-400">/</span>
            }
            classNames={{
              base: "flex items-center text-sm",
              separator: "text-gray-500 dark:text-gray-400",
            }}
          >
            <BreadcrumbItem>
              <Link
                href={`/${slug}`}
                className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                {type.name}
              </Link>
            </BreadcrumbItem>
            <BreadcrumbItem
              classNames={{ item: "text-gray-900 dark:text-gray-100" }}
              isCurrent
            >
              {post.title}
            </BreadcrumbItem>
          </Breadcrumbs>
        </div>

        {/* Title */}
        <Heading level={5} className="sm:text-5xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
          {post.title}
        </Heading>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{readingTime} min read</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>{viewsCount.toLocaleString()} views</span>
          </div>
        </div>
      </div>
    </section>
  );
}
