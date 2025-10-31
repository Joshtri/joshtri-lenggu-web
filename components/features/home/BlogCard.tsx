import Image from "next/image";
import Link from "next/link";
import { Post } from "@/components/features/posts/interfaces/posts";
import { Label } from "@/components/features/labels/interfaces/labels";
import { Calendar, ArrowRight } from "lucide-react";

interface BlogCardProps {
  post: Post;
  label?: Label;
}

export function BlogCard({ post, label }: BlogCardProps) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="group bg-white rounded-lg border-2 border-dashed border-gray-300 overflow-hidden hover:border-gray-900 transition-all duration-300">
      {/* Cover Image */}
      <Link href={`/blog/${post.slug}`} className="block relative h-56 overflow-hidden border-b-2 border-dashed border-gray-300 group-hover:border-gray-900">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
        />
      </Link>

      {/* Content */}
      <div className="p-6">
        {/* Label Badge */}
        {label && (
          <div className="mb-4">
            <span className="inline-block px-3 py-1 text-xs font-medium uppercase tracking-wider border-2 border-dashed border-gray-400 rounded text-gray-700">
              {label.name}
            </span>
          </div>
        )}

        {/* Title */}
        <Link href={`/blog/${post.slug}`}>
          <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:underline transition-all line-clamp-2 tracking-tight">
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm mb-6 line-clamp-3 font-light leading-relaxed">
          {post.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t-2 border-dashed border-gray-200">
          <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wider">
            <Calendar className="h-3.5 w-3.5" />
            <time dateTime={post.createdAt.toISOString()}>
              {formattedDate}
            </time>
          </div>

          <Link
            href={`/blog/${post.slug}`}
            className="flex items-center gap-2 text-sm text-gray-900 font-medium group-hover:gap-3 transition-all"
          >
            <span>Read</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
