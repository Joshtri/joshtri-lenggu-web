import { NextRequest, NextResponse } from "next/server";

/**
 * Simplified Push Subscriptions API
 * Stores subscriptions in memory (no database)
 */

// In-memory storage for push subscriptions
const pushSubscriptions = new Map<string, unknown>();

// POST - Save push subscription
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subscription } = body;

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid subscription",
        },
        { status: 400 }
      );
    }

    // Store in memory
    pushSubscriptions.set(subscription.endpoint, subscription);
    console.log(`✅ Push subscription saved: ${subscription.endpoint}`);

    return NextResponse.json(
      {
        success: true,
        message: "Push subscription saved successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving push subscription:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to save push subscription",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// GET - Get all push subscriptions
export async function GET(request: NextRequest) {
  try {
    const subscriptions = Array.from(pushSubscriptions.values());

    return NextResponse.json(
      {
        success: true,
        data: subscriptions,
        count: subscriptions.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching push subscriptions:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch push subscriptions",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE - Remove push subscription
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { endpoint } = body;

    if (!endpoint) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing endpoint",
        },
        { status: 400 }
      );
    }

    const deleted = pushSubscriptions.delete(endpoint);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          message: "Subscription not found",
        },
        { status: 404 }
      );
    }

    console.log(`✅ Push subscription removed: ${endpoint}`);

    return NextResponse.json(
      {
        success: true,
        message: "Push subscription removed successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing push subscription:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to remove push subscription",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
