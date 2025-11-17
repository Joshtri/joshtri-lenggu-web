"use client";

import Image from "next/image";
import Link from "next/link";
import { Button, Card, CardBody } from "@heroui/react";
import { useTrackPostView } from "@/services/postViewsService";
import { Text } from "@/components/ui/Text";
import { Heading } from "@/components/ui/Heading";
import { addHeadingIds } from "@/lib/addHeadingIds";
import PostReadHeader from "./PostReadHeader";
import TableOfContents from "./TableOfContents";
import ResponsiveCoverImage from "./ResponsiveCoverImage";
import CommentsSection from "@/components/features/comments/CommentsSection";
import ShareButtons from "./ShareButtons";
import TagsList from "./TagsList";
import RelatedPosts from "./RelatedPosts";
import AISummarize from "./AISummarize";
import ReadingProgressBar from "./ReadingProgressBar";
import MoreFromCategory from "./MoreFromCategory";

interface Type {
  id: string;
  name: string;
}

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  createdAt: Date | null;
  viewsCount?: number;
  tags?: string[];
}

interface RelatedPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
}

interface PostReadViewProps {
  post: Post;
  type: Type;
  slug: string;
  relatedPosts?: RelatedPost[];
  moreFromCategory?: Array<{
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    coverImage: string;
    viewsCount?: number;
  }>;
}

export default function PostReadView({
  post,
  type,
  slug,
  relatedPosts = [],
  moreFromCategory = [],
}: PostReadViewProps) {
  // Track post view
  useTrackPostView(post.slug);

  // Calculate reading time
  const readingTime = Math.ceil(
    post.content.replace(/<[^>]*>/g, "").split(/\s+/).length / 200
  );

  // Format date
  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown date";

  // Get current URL for sharing
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Reading Progress Bar - Fixed at Top */}
      <ReadingProgressBar />

      {/* Header Section */}
      <PostReadHeader
        post={post}
        type={type}
        slug={slug}
        formattedDate={formattedDate}
        readingTime={readingTime}
        viewsCount={post.viewsCount || 0}
      />

      {/* Cover Image */}
      {post.coverImage && (
        <ResponsiveCoverImage src={post.coverImage} alt={post.title} priority />
      )}

      {/* Main Content with Sidebars */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Left Sidebar - Desktop Only */}
          <aside className="hidden lg:flex lg:flex-col lg:items-center lg:w-28 xl:w-28 shrink-0">
            <div className="w-full sticky top-24">
              <div className="p-2">
                <ShareButtons title={post.title} url={currentUrl} />
              </div>
            </div>
          </aside>

          {/* Main Article Content */}
          <section className="flex-1 w-full max-w-full lg:max-w-7xl lg:mx-auto">
            {/* AI Summarize - Mobile & Tablet */}
            <div className="lg:hidden mb-4 sm:mb-6 flex justify-start sm:justify-end">
              <div className="w-full sm:w-auto">
                <AISummarize content={post.content} title={post.title} />
              </div>
            </div>

            <Card shadow="md" className="w-full">
              <CardBody className="p-4 sm:p-5 lg:p-6">
                <article className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none">
                  <div
                    className="text-gray-800 dark:text-gray-200 leading-relaxed text-sm sm:text-base"
                    dangerouslySetInnerHTML={{ __html: addHeadingIds(post.content) }}
                  />
                </article>
              </CardBody>
            </Card>

            {/* Share Buttons - Mobile & Tablet */}
            <div className="lg:hidden mt-6">
              <ShareButtons title={post.title} url={currentUrl} />
            </div>
          </section>

          {/* Right Sidebar - Desktop Only */}
          <aside className="hidden lg:block w-full lg:w-28 ml-4 xl:w-28 shrink-0">
            <div className="space-y-4 lg:space-y-6 sticky top-24">
              {/* AI Summarize */}
              <div className="w-full">
                <AISummarize content={post.content} title={post.title} />
              </div>

              {/* Table of Contents */}
              <TableOfContents />

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <Card>
                  <CardBody className="p-3 lg:p-4">
                    <RelatedPosts posts={relatedPosts} categorySlug={slug} />
                  </CardBody>
                </Card>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* Comments Section */}
      <CommentsSection postId={post.id} />

      {/* More from Category Section */}
      <MoreFromCategory type={type} slug={slug} posts={moreFromCategory} />
    </div>
  );
}
