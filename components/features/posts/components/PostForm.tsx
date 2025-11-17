"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { PageHeader } from "@/components/ui/Common/PageHeader";
import RichTextEditor, {
  type RichTextEditorHandle,
} from "@/components/ui/TextEditor";
import { Button } from "@heroui/react";
import { Save, X, FileText } from "lucide-react";
import { CreatePostInput } from "../interfaces/posts";
import { useCreatePost, useUpdatePost, usePost } from "@/services/postsService";
import { useLabels } from "@/services/labelsService";
import { useTypes } from "@/services/typesService";
import axios from "axios";
import PostInformation from "./PostInformation";
import TipsCard from "./TipsCard";
import StatsCard from "./StatsCard";
import EmptyState from "@/components/ui/Common/EmptyState";
import { Text } from "@/components/ui/Text";
import { Card, CardBody } from "@heroui/react";
import { LoadingScreen } from "@/components/ui/Loading/LoadingScreen";
import { Heading } from "@/components/ui/Heading";

type PostFormData = {
  title: string;
  slug: string;
  coverImage: string | File;
  content: string;
  excerpt: string;
  status: 'draft' | 'published' | 'archived';
  authorId?: number;
  labelId?: string;
  typeId?: string;
};

interface PostFormProps {
  mode: "create" | "edit";
  postId?: string;
}

export default function PostForm({ mode, postId }: PostFormProps) {
  const router = useRouter();
  const editorRef = useRef<RichTextEditorHandle>(null);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [isLoading, setIsLoading] = useState(mode === "edit");

  // Fetch post data only in edit mode
  const { data: postData, isLoading: postLoading } = usePost(
    postId || ""
  );
  const post = mode === "edit" && postId ? postData?.data : null;

  const methods = useForm<PostFormData>({
    defaultValues: {
      title: "",
      slug: "",
      coverImage: "",
      content: "",
      excerpt: "",
      status: "published",
      labelId: "",
      typeId: "",
    },
  });

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = methods;

  const createPost = useCreatePost();
  const updatePost = useUpdatePost();

  // Fetch labels and types
  const { data: labelsData, isLoading: labelsLoading } = useLabels();
  const { data: typesData, isLoading: typesLoading } = useTypes();

  const labels = labelsData?.data || [];
  const types = typesData?.data || [];

  // Watch fields
  const watchedTitle = watch("title");
  const watchedContent = watch("content");

  // Populate form when post data is loaded (edit mode only)
  useEffect(() => {
    if (mode === "edit" && post) {
      reset({
        title: post.title,
        slug: post.slug,
        coverImage: post.coverImage,
        content: post.content,
        excerpt: post.excerpt,
        status: post.status || "published",
        labelId: post.labelId?.toString() || "",
        typeId: post.typeId?.toString() || "",
      });

      // Set content in editor with small delay to ensure Quill is ready
      setTimeout(() => {
        if (editorRef.current && post.content) {
          editorRef.current.setContent(post.content);
        }
      }, 100);

      setIsLoading(false);
    }
  }, [post, reset, mode]);

  // Auto-generate slug from title
  useEffect(() => {
    if (watchedTitle) {
      // In edit mode, only auto-generate if title changed from original
      if (mode === "edit" && post && watchedTitle === post.title) {
        return;
      }

      const slug = watchedTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setValue("slug", slug, { shouldValidate: true });
    }
  }, [watchedTitle, setValue, mode, post]);

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

      // Handle cover image upload (only if it's a File)
      if (data.coverImage instanceof File) {
        console.log("📤 Uploading cover image...");
        const formData = new FormData();
        formData.append("file", data.coverImage);
        formData.append("folder", "posts");

        const uploadResponse = await axios.post<{
          success: boolean;
          fileUrl: string;
          fileId: string;
          fileName: string;
        }>(
          "/api/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        coverImageUrl = uploadResponse.data.fileUrl;
        console.log("✅ Image uploaded:", coverImageUrl);
      } else if (typeof data.coverImage === "string") {
        // In edit mode, if coverImage is already a string URL, use it
        coverImageUrl = data.coverImage;
      }

      if (!coverImageUrl) {
        throw new Error("Failed to get cover image URL");
      }

      const postData: CreatePostInput = {
        id: postId || "",
        title: data.title,
        slug: data.slug,
        coverImage: coverImageUrl,
        content: latestContent,
        excerpt: data.excerpt,
        status: data.status,
        labelId: data.labelId as unknown as string,
        typeId: data.typeId as unknown as string,
      };

      console.log(`📤 ${mode === "create" ? "Creating" : "Updating"} post...`, JSON.stringify(postData, null, 2));

      if (mode === "create") {
        await createPost.mutateAsync(postData);
        console.log("✅ Post created successfully!");
        router.push("/posts");
      } else if (mode === "edit" && postId) {
        // @ts-expect-error: authorId is a number in UpdatePostInput, but string in CreatePostInput
        await updatePost.mutateAsync({ id: postId, data: postData });
        console.log("✅ Post updated successfully!");
        router.push(`/posts/${postId}`);
      }
    } catch (error) {
      console.error(`Error ${mode === "create" ? "creating" : "updating"} post:`, error);
      alert(
        error instanceof Error
          ? error.message
          : `Failed to ${mode === "create" ? "create" : "update"} post. Please try again.`
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

  if (mode === "edit" && (postLoading || isLoading)) {
    return <></>;
  }

  if (mode === "edit" && !post) {
    return (
      <EmptyState
        title={"Post not found"}
        description={"The post you are looking for does not exist."}
      />
    );
  }

  const isCreate = mode === "create";
  const cancelPath = isCreate ? "/posts" : `/posts/${postId}`;

  const loading = postLoading || labelsLoading || typesLoading;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <LoadingScreen isLoading={loading || isSubmitting} />
      <PageHeader
        title={isCreate ? "Create New Post" : "Edit Post"}
        description={
          isCreate
            ? "Start writing content that inspires and share it with the world."
            : "Update your blog post content and metadata."
        }
        actions={
          <>
            {isDirty && (
              <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800 px-3 py-1.5 rounded-md flex items-center gap-1">
                <div className="w-2 h-2 bg-orange-500 dark:bg-orange-400 rounded-full animate-pulse" />
                Unsaved
              </span>
            )}
            <Button
              variant="bordered"
              size="sm"
              isDisabled={isSubmitting}
              onPress={() => router.push(cancelPath)}
              className="dark:border-gray-700 dark:text-gray-200"
            >
              Cancel
            </Button>
            <Button
              color="primary"
              size="sm"
              isLoading={isSubmitting}
              onPress={() => handleSubmit(onSubmit)()}
              startContent={!isSubmitting && <Save className="h-4 w-4" />}
            >
              {isSubmitting
                ? isCreate
                  ? "Uploading & Saving..."
                  : "Updating & Saving..."
                : isCreate
                ? "Save Post"
                : "Save Changes"}
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
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                  <div className="p-4 bg-linear-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-750 border-b border-gray-200 dark:border-gray-700">
                    <Heading className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                      <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      Content Editor
                    </Heading>
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
                        <p className="text-sm text-red-500 dark:text-red-400 flex items-center mt-2">
                          <X className="h-4 w-4 mr-1" />
                          {errors.content.message as string}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats Card */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                  <StatsCard
                    wordCount={wordCount}
                    charCount={charCount}
                    readingTime={readingTime}
                    currentDate={currentDate}
                  />
                </div>
              </div>

              {/* Form Fields Column - Right Side */}
              <div className="space-y-6">
                {/* Post Information */}
                <PostInformation labelsOptions={labels} typesOptions={types} />

                {/* Tips Card */}
                {isCreate ? (
                  <TipsCard />
                ) : (
                  <Card className="dark:bg-gray-800 dark:border-gray-700">
                    <CardBody>
                      <Text className="text-sm text-blue-700 dark:text-blue-400">
                        <strong>Tip:</strong> Make sure all fields are filled
                        out before saving. The slug will be auto-generated from
                        the title if changed.
                      </Text>
                    </CardBody>
                  </Card>
                )}
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
