import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { labels } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET - Fetch single label by ID
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const labelId = id;

        //falsy -> said if this is empty string, null, undefined, 0, false
        if (!labelId) {
            return NextResponse.json(
                { success: false, message: "Invalid label ID" },
                { status: 400 }
            );
        }

        const result = await db
            .select()
            .from(labels)
            .where(eq(labels.id, labelId))
            .limit(1);

        if (result.length === 0) {
            return NextResponse.json(
                { success: false, message: "Label not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, data: result[0], message: "Label fetched successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching label:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch label",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}

// PATCH - Update label (partial update)
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const labelId = (id);

        if (!labelId) {
            return NextResponse.json(
                { success: false, message: "Invalid label ID" },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { name, color, description } = body ?? {};

        // Ensure label exists
        const existing = await db
            .select()
            .from(labels)
            .where(eq(labels.id, labelId))
            .limit(1);

        if (existing.length === 0) {
            return NextResponse.json(
                { success: false, message: "Label not found" },
                { status: 404 }
            );
        }

        // Build partial update object
        const updateData: Record<string, unknown> = {};
        if (name !== undefined) updateData.name = name;
        if (color !== undefined) updateData.color = color;
        if (description !== undefined) updateData.description = description;

        const updated = await db
            .update(labels)
            .set(updateData)
            .where(eq(labels.id, labelId))
            .returning();

        return NextResponse.json(
            { success: true, data: updated[0], message: "Label updated successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating label:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to update label",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}

// DELETE - Delete label
export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const labelId = id;

        if (!labelId) {
            return NextResponse.json(
                { success: false, message: "Invalid label ID" },
                { status: 400 }
            );
        }

        // Ensure label exists
        const existing = await db
            .select()
            .from(labels)
            .where(eq(labels.id, labelId))
            .limit(1);

        if (existing.length === 0) {
            return NextResponse.json(
                { success: false, message: "Label not found" },
                { status: 404 }
            );
        }

        await db.delete(labels).where(eq(labels.id, labelId));

        return NextResponse.json(
            { success: true, message: "Label deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting label:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete label",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}


