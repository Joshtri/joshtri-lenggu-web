import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { posts, comments, postViews, labels } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

// GET - Fetch single post by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid post ID",
        },
        { status: 400 }
      );
    }

    const post = await db
      .select({
        id: posts.id,
        slug: posts.slug,
        title: posts.title,
        excerpt: posts.excerpt,
        content: posts.content,
        coverImage: posts.coverImage,
        authorId: posts.authorId,
        labelId: posts.labelId,
        typeId: posts.typeId,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        viewsCount: posts.viewsCount,
        label: {
          id: labels.id,
          name: labels.name,
          color: labels.color,
          description: labels.description,
        },
      })
      .from(posts)
      .leftJoin(labels, eq(posts.labelId, labels.id))
      .where(eq(posts.id, id))
      .limit(1);

    if (post.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Post not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: post[0],
        message: "Post fetched successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch post",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// PATCH - Update post (partial update)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid post ID",
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { slug, title, coverImage, content, excerpt, status, authorId, labelId, typeId } =
      body;

    // Check if post exists
    const existingPost = await db
      .select()
      .from(posts)
      .where(eq(posts.id, id))
      .limit(1);

    if (existingPost.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Post not found",
        },
        { status: 404 }
      );
    }

    // If slug is being updated, check if it's already taken
    if (slug && slug !== existingPost[0].slug) {
      const slugExists = await db
        .select()
        .from(posts)
        .where(eq(posts.slug, slug))
        .limit(1);

      if (slugExists.length > 0) {
        return NextResponse.json(
          {
            success: false,
            message: "Post with this slug already exists",
          },
          { status: 409 }
        );
      }
    }

    // Build update object with only provided fields
    const updateData: Record<string, unknown> = {};
    if (slug !== undefined) updateData.slug = slug;
    if (title !== undefined) updateData.title = title;
    if (coverImage !== undefined) updateData.coverImage = coverImage;
    if (content !== undefined) updateData.content = content;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (status !== undefined) updateData.status = status;
    if (authorId !== undefined) updateData.authorId = authorId;
    if (labelId !== undefined) updateData.labelId = labelId;
    if (typeId !== undefined) updateData.typeId = typeId;

    const updatedPost = await db
      .update(posts)
      .set(updateData)
      .where(eq(posts.id, id))
      .returning();

    return NextResponse.json(
      {
        success: true,
        data: updatedPost[0],
        message: "Post updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update post",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid post ID",
        },
        { status: 400 }
      );
    }

    // Check if post exists
    const existingPost = await db
      .select()
      .from(posts)
      .where(eq(posts.id, id))
      .limit(1);

    if (existingPost.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Post not found",
        },
        { status: 404 }
      );
    }

    // Delete related records first (cascade delete)
    await db.delete(comments).where(eq(comments.postId, id));
    await db.delete(postViews).where(eq(postViews.postId, id));
    
    // Then delete the post
    await db.delete(posts).where(eq(posts.id, id));

    return NextResponse.json(
      {
        success: true,
        message: "Post deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete post",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
