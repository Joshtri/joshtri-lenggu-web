import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { types, posts } from "@/db/schema";
import { count, eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    // Fetch all types with count of posts for each type
    const typesWithCounts = await db
      .select({
        id: types.id,
        name: types.name,
        description: types.description,
        postCount: count(posts.id),
      })
      .from(types)
      .leftJoin(posts, eq(posts.typeId, types.id))
      .groupBy(types.id, types.name, types.description);

    return NextResponse.json(
      {
        success: true,
        data: typesWithCounts,
        message: "Types fetched successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching types:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch types",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
