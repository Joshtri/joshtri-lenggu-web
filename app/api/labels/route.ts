import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { labels } from "@/db/schema";
import { desc } from "drizzle-orm";

// GET - Fetch all labels
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const limit = searchParams.get("limit");
        const offset = searchParams.get("offset");

        const qb = db
            .select()
            .from(labels)
            .orderBy(desc(labels.createdAt))
            .$dynamic();

        if (limit) qb.limit(Number(limit));
        if (offset) qb.offset(Number(offset));

        const allLabels = await qb;

        return NextResponse.json(
            {
                success: true,
                data: allLabels,
                message: "Labels fetched successfully",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching labels:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch labels",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}

// POST - Create new label
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, color, description } = body ?? {};

        if (!name || !color) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        const newLabel = await db
            .insert(labels)
            .values({ name, color, description: description ?? null })
            .returning();

        return NextResponse.json(
            {
                success: true,
                data: newLabel[0],
                message: "Label created successfully",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating label:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to create label",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}