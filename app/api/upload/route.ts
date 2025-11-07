import { storage } from "@/lib/appwrite";
import { ID } from "appwrite";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Validate file type (images only)
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    // Convert File to Buffer for Appwrite
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a File object that Appwrite expects
    const appwriteFile = new File([buffer], file.name, {
      type: file.type,
    });

    // Upload to Appwrite Storage
    const bucketId = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID;
    if (!bucketId) {
      throw new Error("Appwrite bucket ID not configured");
    }

    const response = await storage.createFile(
      bucketId,
      ID.unique(),
      appwriteFile
    );

    console.log("✅ Appwrite upload response:", {
      id: response.$id,
      name: response.name,
    });

    // Construct file URL manually - more reliable
    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

    // Use getFileView for direct access or construct URL manually
    const fileUrl = `${endpoint}/storage/buckets/${bucketId}/files/${response.$id}/view?project=${projectId}&mode=admin`;

    console.log("✅ Generated file URL:", fileUrl);

    const responseData = {
      success: true,
      fileId: response.$id,
      fileName: response.name,
      fileUrl: fileUrl,
      message: "File uploaded successfully",
    };

    console.log("✅ Sending response to client:", JSON.stringify(responseData, null, 2));

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Upload failed",
      },
      { status: 500 }
    );
  }
}
