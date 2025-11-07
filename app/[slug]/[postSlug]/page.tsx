import { notFound } from "next/navigation";
import { db } from "@/db";
import { posts, types } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { textToSlug } from "@/lib/slug";
import PostReadView from "@/components/features/posts/read/PostReadView";

interface PostPageProps {
  params: Promise<{
    slug: string;
    postSlug: string;
  }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug, postSlug } = await params;

  // Find type by slug
  const typeList = await db.select().from(types);
  const type = typeList.find(
    (t) => textToSlug(t.name) === slug
  );

  if (!type) {
    notFound();
  }

  // Find post by slug and typeId
  const post = await db
    .select()
    .from(posts)
    .where(
      and(
        eq(posts.slug, postSlug),
        eq(posts.typeId, type.id)
      )
    )
    .limit(1);

  if (post.length === 0) {
    notFound();
  }

  return <PostReadView post={post[0]} type={type} slug={slug} />;
}
