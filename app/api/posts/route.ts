import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { posts, users } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

// GET - Fetch all posts
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");

    const qb = db
      .select()
      .from(posts)
      .orderBy(desc(posts.createdAt))
      .$dynamic();

    if (limit) {
      qb.limit(Number(limit));
    }

    if (offset) {
      qb.offset(Number(offset));
    }

    const allPosts = await qb;

    return NextResponse.json(
      {
        success: true,
        data: allPosts,
        message: "Posts fetched successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch posts",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST - Create new post
export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized - Please sign in",
        },
        { status: 401 }
      );
    }

    // TEMPORARY: Hardcode user ID
    // TODO: Get from database using clerkId later
    const TEMP_HARDCODED_USER_ID = "user_34mXgMUtSi7IXY6wZLReExxZ1l6";

    // Get user from database using clerkId
    const user = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, TEMP_HARDCODED_USER_ID))
      .limit(1);

    if (!user || user.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Hardcoded user not found in database. Please add user first.",
        },
        { status: 404 }
      );
    }

    const dbUserId = user[0].id;

    const body = await request.json();
    const { slug, title, coverImage, content, excerpt, labelId, typeId } = body;

    console.log("✅ Received body:", body);
    console.log("✅ Authenticated clerkId:", userId);
    console.log("✅ Database userId:", dbUserId);

    // Validation
    if (!slug || !title || !coverImage || !content || !excerpt || !labelId || !typeId) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
          missingFields: {
            slug: !slug,
            title: !title,
            coverImage: !coverImage,
            content: !content,
            excerpt: !excerpt,
            labelId: !labelId,
            typeId: !typeId,
          },
        },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingPost = await db
      .select()
      .from(posts)
      .where(eq(posts.slug, slug))
      .limit(1);

    if (existingPost.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Post with this slug already exists",
        },
        { status: 409 }
      );
    }

    const newPost = await db
      .insert(posts)
      .values({
        slug,
        title,
        coverImage,
        content,
        excerpt,
        authorId: dbUserId, // Use database user ID
        labelId: labelId,
        typeId: typeId,
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        data: newPost[0],
        message: "Post created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create post",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
