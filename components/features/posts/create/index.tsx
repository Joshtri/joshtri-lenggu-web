"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { PageHeader } from "@/components/ui/Common/PageHeader";
import RichTextEditor, {
  type RichTextEditorHandle,
} from "@/components/ui/TextEditor";
import { TextInput } from "@/components/ui/Inputs/TextInput";
import { TextareaInput } from "@/components/ui/Inputs/TextareaInput";
import { SelectInput } from "@/components/ui/Inputs/SelectInput";
import { ImageUpload } from "@/components/ui/Inputs/ImageUpload";
import { Button } from "@heroui/react";
import { Save, X, FileText, Type, Clock, Calendar } from "lucide-react";
import { CreatePostInput } from "../interfaces/posts";
import { useCreatePost } from "@/services/postsService";
import { useLabels } from "@/services/labelsService";
import { useTypes } from "@/services/typesService";
import axios from "axios";

type PostFormData = {
  title: string;
  slug: string;
  coverImage: string | File;
  content: string;
  excerpt: string;
  authorId?: number;
  labelId?: string;
  typeId?: string;
};

export default function PostCreate() {
  const router = useRouter();
  const editorRef = useRef<RichTextEditorHandle>(null);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);

  const methods = useForm<PostFormData>({
    defaultValues: {
      title: "",
      slug: "",
      coverImage: "",
      content: "",
      excerpt: "",
      labelId: "",
      typeId: "",
    },
  });

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = methods;

  const createPost = useCreatePost();

  // Fetch labels and types
  const { data: labelsData, isLoading: labelsLoading } = useLabels();
  const { data: typesData, isLoading: typesLoading } = useTypes();

  const labels = labelsData?.data || [];
  const types = typesData?.data || [];

  // Watch fields
  const watchedTitle = watch("title");
  const watchedContent = watch("content");

  // Auto-generate slug from title
  useEffect(() => {
    if (watchedTitle) {
      const slug = watchedTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setValue("slug", slug, { shouldValidate: true });
    }
  }, [watchedTitle, setValue]);

  // Count words, characters, and estimate reading time
  useEffect(() => {
    if (watchedContent) {
      const text = watchedContent.replace(/<[^>]*>/g, "");
      const words = text.split(/\s+/).filter((word) => word.length > 0);
      const wordCount = words.length;
      const charCount = text.length;
      const readingTime = Math.ceil(wordCount / 200);

      setWordCount(wordCount);
      setCharCount(charCount);
      setReadingTime(readingTime);
    }
  }, [watchedContent]);

  const handleContentChange = (content: string) => {
    setValue("content", content, { shouldValidate: true, shouldDirty: true });
  };

  const onSubmit = async (data: PostFormData) => {
    try {
      // Get the latest content from editor
      const latestContent = editorRef.current?.getContent() || data.content;

      if (
        !latestContent ||
        latestContent.replace(/<[^>]*>/g, "").trim().length === 0
      ) {
        alert("Content is required");
        return;
      }

      if (!data.coverImage) {
        alert("Cover image is required");
        return;
      }

      if (!data.labelId) {
        alert("Label is required");
        return;
      }

      if (!data.typeId) {
        alert("Type is required");
        return;
      }

      let coverImageUrl: string = "";

      // If coverImage is a File object, upload it first
      if (data.coverImage instanceof File) {
        console.log("📤 Starting image upload...");
        console.log("📤 File info:", {
          name: data.coverImage.name,
          size: data.coverImage.size,
          type: data.coverImage.type,
        });

        const formData = new FormData();
        formData.append("file", data.coverImage);

        const uploadResponse = await axios.post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("📥 Upload response:", JSON.stringify(uploadResponse.data, null, 2));

        if (!uploadResponse.data.success) {
          throw new Error(uploadResponse.data.error || "Failed to upload image");
        }

        // Get fileUrl from response
        if (uploadResponse.data.fileUrl) {
          coverImageUrl = uploadResponse.data.fileUrl;
          console.log("✅ Got fileUrl from response:", coverImageUrl);
        } else if (uploadResponse.data.fileId) {
          // Construct URL manually as fallback
          const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
          const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
          const bucketId = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID;
          coverImageUrl = `${endpoint}/storage/buckets/${bucketId}/files/${uploadResponse.data.fileId}/view?project=${projectId}&mode=admin`;
          console.log("✅ Constructed URL from fileId:", coverImageUrl);
        } else {
          console.error("❌ No fileUrl or fileId in response:", uploadResponse.data);
          throw new Error("No file URL or file ID in response");
        }
      } else if (typeof data.coverImage === "string") {
        // If it's already a URL (edit mode)
        coverImageUrl = data.coverImage;
        console.log("✅ Using existing URL:", coverImageUrl);
      } else {
        console.error("❌ Invalid coverImage type:", typeof data.coverImage);
        throw new Error("Invalid cover image");
      }

      console.log("🖼️ Final coverImageUrl:", coverImageUrl);

      // Validate coverImageUrl before creating post
      if (!coverImageUrl || coverImageUrl.trim() === "") {
        console.error("❌ coverImageUrl is empty!");
        throw new Error("Failed to get image URL");
      }

      const postData: CreatePostInput = {
        title: data.title,
        slug: data.slug,
        coverImage: coverImageUrl,
        content: latestContent,
        excerpt: data.excerpt,
        labelId: data.labelId as unknown as number,
        typeId: data.typeId as unknown as number,
      };

      console.log("📤 Sending post data:", JSON.stringify(postData, null, 2));
      console.log("📤 coverImage value:", postData.coverImage);
      console.log("📤 coverImage type:", typeof postData.coverImage);
      console.log("📤 coverImage length:", postData.coverImage?.length);

      await createPost.mutateAsync(postData);
      console.log("✅ Post created successfully!");
      router.push("/posts");
    } catch (error) {
      console.error("Error creating post:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to create post. Please try again."
      );
    }
  };

  // Use state to avoid SSR mismatch
  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
    setCurrentDate(
      new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      })
    );
  }, []);

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Create New Post"
        description="Start writing content that inspires and share it with the world."
        actions={
          <>
            {isDirty && (
              <span className="text-xs bg-orange-100 text-orange-700 border border-orange-200 px-3 py-1.5 rounded-md flex items-center gap-1">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                Unsaved
              </span>
            )}
            <Button
              variant="bordered"
              size="sm"
              isDisabled={isSubmitting}
              onPress={() => router.push("/posts")}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              size="sm"
              isLoading={isSubmitting}
              onPress={handleSubmit(onSubmit)}
              startContent={!isSubmitting && <Save className="h-4 w-4" />}
            >
              {isSubmitting ? "Uploading & Saving..." : "Save Post"}
            </Button>
          </>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Editor Column - Left Side */}
              <div className="lg:col-span-2 space-y-6">
                {/* Editor Card */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      Content Editor
                    </h3>
                  </div>
                  <div className="p-0">
                    <div
                      className={`border-0 rounded-lg overflow-hidden ${
                        errors.content ? "ring-2 ring-red-500" : ""
                      }`}
                    >
                      <RichTextEditor
                        ref={editorRef}
                        onChange={handleContentChange}
                        placeholder="Start writing your inspiring content..."
                        className="w-full"
                      />
                    </div>
                    {errors.content && (
                      <div className="px-6 pb-4">
                        <p className="text-sm text-red-500 flex items-center mt-2">
                          <X className="h-4 w-4 mr-1" />
                          {errors.content.message as string}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats Card */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <div className="p-2 bg-blue-500 rounded-lg">
                        <Type className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-700">
                          Words
                        </p>
                        <p className="text-lg font-bold text-blue-900">
                          {wordCount}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <div className="p-2 bg-green-500 rounded-lg">
                        <FileText className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-700">
                          Characters
                        </p>
                        <p className="text-lg font-bold text-green-900">
                          {charCount}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                      <div className="p-2 bg-purple-500 rounded-lg">
                        <Clock className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-purple-700">
                          Read
                        </p>
                        <p className="text-lg font-bold text-purple-900">
                          {readingTime} min
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                      <div className="p-2 bg-orange-500 rounded-lg">
                        <Calendar className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-orange-700">
                          Date
                        </p>
                        <p className="text-sm font-bold text-orange-900">
                          {currentDate}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Fields Column - Right Side */}
              <div className="space-y-6">
                {/* Post Information */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <h3 className="text-lg font-semibold">Post Information</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <TextInput
                      name="title"
                      label="Title"
                      placeholder="Enter an engaging post title"
                      required
                      validation={{
                        required: "Title is required",
                        minLength: {
                          value: 3,
                          message: "Title must be at least 3 characters",
                        },
                      }}
                    />

                    <TextInput
                      name="slug"
                      label="Slug"
                      placeholder="your-post-url"
                      required
                      validation={{
                        required: "Slug is required",
                        pattern: {
                          value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                          message: "Slug must be in kebab-case format",
                        },
                      }}
                    />

                    <ImageUpload
                      name="coverImage"
                      label="Cover Image"
                      required
                      helperText="Upload an image (max 5MB)"
                    />

                    <SelectInput
                      name="labelId"
                      label="Label"
                      placeholder="Select a label"
                      options={labels.map((label) => ({
                        label: label.name,
                        value: label.id,
                      }))}
                      required
                      disabled={labelsLoading}
                    />

                    <SelectInput
                      name="typeId"
                      label="Type"
                      placeholder="Select a type"
                      options={types.map((type) => ({
                        label: type.name,
                        value: type.id,
                      }))}
                      required
                      disabled={typesLoading}
                    />

                    <TextareaInput
                      name="excerpt"
                      label="Excerpt"
                      placeholder="Brief summary for preview and SEO..."
                      required
                      minRows={3}
                      maxLength={300}
                      description="Max 300 characters"
                    />
                  </div>
                </div>

                {/* Publishing Info */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-4">
                  <p className="text-sm text-blue-700">
                    <strong>💡 Tip:</strong> Make sure all fields are filled out
                    before saving. The slug will be auto-generated from the
                    title.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
