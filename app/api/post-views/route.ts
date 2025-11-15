import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { posts, postViews } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug } = body;

    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Post slug is required",
        },
        { status: 400 }
      );
    }

    // Find post by slug
    const post = await db
      .select()
      .from(posts)
      .where(eq(posts.slug, slug))
      .limit(1);

    if (!post || post.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Post not found",
        },
        { status: 404 }
      );
    }

    const postId = post[0].id;

    // Record view
    await db.insert(postViews).values({
      postId,
    });

    // Increment views count in posts table
    const updatedPost = await db
      .update(posts)
      .set({ viewsCount: sql`${posts.viewsCount} + 1` })
      .where(eq(posts.id, postId))
      .returning({ viewsCount: posts.viewsCount });

    return NextResponse.json(
      {
        success: true,
        message: "View recorded successfully",
        data: { viewsCount: updatedPost[0].viewsCount },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error recording view:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to record view",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
