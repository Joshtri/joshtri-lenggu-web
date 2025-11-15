import { notFound } from "next/navigation";
import { Metadata } from "next";
import Script from "next/script";
import { db } from "@/db";
import { posts, types } from "@/db/schema";
import { eq, and, desc, ne } from "drizzle-orm";
import { textToSlug } from "@/lib/slug";
import PostReadView from "@/components/features/posts/read/PostReadView";
import { generateBlogPostSchema } from "@/lib/schema";

interface PostPageProps {
  params: Promise<{
    slug: string;
    postSlug: string;
  }>;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug, postSlug } = await params;

  // Find type by slug
  const typeList = await db.select().from(types);
  const type = typeList.find((t) => textToSlug(t.name) === slug);

  if (!type) {
    return {
      title: "Post Not Found",
      description: "The post you are looking for does not exist.",
    };
  }

  // Find post by slug and typeId
  const post = await db
    .select()
    .from(posts)
    .where(and(eq(posts.slug, postSlug), eq(posts.typeId, type.id)))
    .limit(1);

  if (post.length === 0) {
    return {
      title: "Post Not Found",
      description: "The post you are looking for does not exist.",
    };
  }

  const currentPost = post[0];
  const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return {
    title: currentPost.title,
    description: currentPost.excerpt || currentPost.content?.substring(0, 160) || "Read this blog post on Joshtri Lenggu Blog",
    // keywords: currentPost.tags?.join(", ") || "blog, technology, learning",
    keywords: "blog, technology, learning",
    authors: [
      {
        name: "Joshtri Lenggu",
      },
    ],
    openGraph: {
      title: currentPost.title,
      description: currentPost.excerpt || currentPost.content?.substring(0, 160),
      type: "article",
      publishedTime: currentPost.createdAt?.toISOString(),
      modifiedTime: currentPost.updatedAt?.toISOString(),
      url: `${BASE_URL}/${slug}/${postSlug}`,
      images: [
        {
          url: currentPost.coverImage || `${BASE_URL}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: currentPost.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: currentPost.title,
      description: currentPost.excerpt || currentPost.content?.substring(0, 160),
      images: [currentPost.coverImage || `${BASE_URL}/og-image.jpg`],
    },
    alternates: {
      canonical: `${BASE_URL}/${slug}/${postSlug}`,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug, postSlug } = await params;

  // Find type by slug
  const typeList = await db.select().from(types);
  const type = typeList.find((t) => textToSlug(t.name) === slug);

  if (!type) {
    notFound();
  }

  // Find post by slug and typeId
  const post = await db
    .select()
    .from(posts)
    .where(and(eq(posts.slug, postSlug), eq(posts.typeId, type.id)))
    .limit(1);

  if (post.length === 0) {
    notFound();
  }

  // Fetch more from category posts sorted by views (excluding current post)
  const moreFromCategory = await db
    .select()
    .from(posts)
    .where(and(eq(posts.typeId, type.id), ne(posts.id, post[0].id)))
    .orderBy(desc(posts.viewsCount))
    .limit(6);

  const currentPost = post[0];
  const schema = generateBlogPostSchema(currentPost);

  return (
    <>
      {/* JSON-LD Schema Markup */}
      <Script
        id={`blog-schema-${currentPost.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
        strategy="afterInteractive"
      />
      <PostReadView
        post={currentPost}
        type={type}
        slug={slug}
        moreFromCategory={moreFromCategory}
      />
    </>
  );
}
