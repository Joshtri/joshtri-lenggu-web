import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import {
  syncUserToDatabase,
  deleteUserFromDatabase,
  ClerkUserData,
} from "@/services/userSyncService";

export async function POST(req: Request) {
  // console.log("🔔 Webhook received!");

  // Get the Svix headers for verification
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    // console.error("❌ CLERK_WEBHOOK_SECRET not found in .env!");
    return new Response("Error: Missing webhook secret", { status: 500 });
  }

  // console.log("✅ Webhook secret found");

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // console.log("📋 Headers:", {
  //   svix_id: svix_id ? "✅" : "❌",
  //   svix_timestamp: svix_timestamp ? "✅" : "❌",
  //   svix_signature: svix_signature ? "✅" : "❌",
  // });

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    // console.error("❌ Missing svix headers");
    return new Response("Error: Missing svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the webhook signature
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
    // console.log("✅ Signature verified!");
  } catch (_err) {
    // console.error("❌ Webhook verification failed:", err);
    return new Response("Error: Verification failed", {
      status: 400,
    });
  }

  // Handle the webhook event
  const eventType = evt.type;
  // console.log(`📨 Event type: ${eventType}`);

  try {
    if (eventType === "user.created" || eventType === "user.updated") {
      const clerkUser = evt.data as ClerkUserData;

      // console.log(`${eventType}: Syncing user ${clerkUser.id} to database`);

      await syncUserToDatabase(clerkUser);

      // console.log(`✅ User ${clerkUser.id} synced successfully`);
    } else if (eventType === "user.deleted") {
      const clerkUserId = evt.data.id;

      // console.log(`user.deleted: Removing user ${clerkUserId} from database`);

      if (clerkUserId) {
        await deleteUserFromDatabase(clerkUserId as string);
      }

      // console.log(`✅ User ${clerkUserId} deleted successfully`);
    }

    // console.log("✅ Webhook processed successfully");
    return new Response("Webhook processed successfully", { status: 200 });
  } catch (_error) {
    // console.error("❌ Error processing webhook:", error);
    // console.error("Full error:", error);
    return new Response("Error processing webhook", { status: 500 });
  }
}

// Add GET endpoint for testing
export async function GET() {
  return Response.json({
    status: "Clerk webhook endpoint is running",
    timestamp: new Date().toISOString(),
    env: {
      hasWebhookSecret: !!process.env.CLERK_WEBHOOK_SECRET,
    },
  });
}
