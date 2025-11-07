import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { comments } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

// GET - Fetch all comments (with optional filtering by postId)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");
    const postId = searchParams.get("postId");

    let qb = db
      .select()
      .from(comments)
      .orderBy(desc(comments.createdAt))
      .$dynamic();

    // Filter by postId if provided
    if (postId) {
      qb = qb.where(eq(comments.postId, Number(postId)));
    }

    if (limit) {
      qb = qb.limit(Number(limit));
    }

    if (offset) {
      qb = qb.offset(Number(offset));
    }

    const allComments = await qb;

    return NextResponse.json(
      {
        success: true,
        data: allComments,
        message: "Comments fetched successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch comments",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST - Create new comment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, authorId, postId, parentId } = body;

    // Validation
    if (!content || !postId) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields: content and postId are required",
        },
        { status: 400 }
      );
    }

    const newComment = await db
      .insert(comments)
      .values({
        content,
        authorId: authorId || null,
        postId,
        parentId: parentId || null,
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        data: newComment[0],
        message: "Comment created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create comment",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
