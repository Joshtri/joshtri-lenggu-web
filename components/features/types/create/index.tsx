"use client";

import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { PageHeader } from "@/components/ui/Common/PageHeader";
import { TextInput } from "@/components/ui/Inputs/TextInput";
import { TextareaInput } from "@/components/ui/Inputs/TextareaInput";
import { Button } from "@heroui/react";
import { Save, FileType } from "lucide-react";
import { useCreateType, useUpdateType } from "@/services/typesService";
import {
  CreateTypeInput,
  UpdateTypeInput,
  Type,
} from "../interfaces";
import { Text } from "@/components/ui/Text";

type TypeFormData = {
  name: string;
  description?: string;
};

interface TypeFormProps {
  initialData?: Type;
  mode?: "create" | "update";
}

export default function TypeForm({
  initialData,
  mode = "create",
}: TypeFormProps) {
  const router = useRouter();
  const isUpdateMode = mode === "update" && initialData;

  const methods = useForm<TypeFormData>({
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
    },
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = methods;

  const createType = useCreateType();
  const updateType = useUpdateType();

  const onSubmit = async (data: TypeFormData) => {
    try {
      if (isUpdateMode) {
        const updateData: UpdateTypeInput = {
          name: data.name,
          description: data.description || undefined,
        };
        await updateType.mutateAsync({ id: initialData.id, data: updateData });
      } else {
        const createData: CreateTypeInput = {
          name: data.name,
          description: data.description || undefined,
        };
        await createType.mutateAsync(createData);
      }
      router.push("/types");
    } catch (error) {
      console.error(
        `Error ${isUpdateMode ? "updating" : "creating"} type:`,
        error
      );
    }
  };

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title={isUpdateMode ? "Update Type" : "Create New Type"}
        description={
          isUpdateMode
            ? "Update type information to keep your content organized."
            : "Create types to categorize your blog posts (e.g., blog-personal, teknologi)."
        }
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
              onPress={() => router.push("/types")}
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
                ? isUpdateMode
                  ? "Updating..."
                  : "Creating..."
                : isUpdateMode
                ? "Update Type"
                : "Create Type"}
            </Button>
          </>
        }
      />
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
            {/* Form Fields Column - Left Side */}
            <div className="lg:col-span-2 space-y-6">
              {/* Type Information Card */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FileType className="h-5 w-5 text-blue-600" />
                    Type Information
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  <TextInput
                    name="name"
                    label="Type Name"
                    placeholder="e.g., blog-personal, teknologi, tutorial"
                    required
                    validation={{
                      required: "Type name is required",
                      minLength: {
                        value: 2,
                        message: "Type name must be at least 2 characters",
                      },
                      maxLength: {
                        value: 50,
                        message: "Type name must not exceed 50 characters",
                      },
                    }}
                  />

                  <TextareaInput
                    name="description"
                    label="Description"
                    placeholder="Add a brief description (optional)..."
                    required={false}
                    minRows={3}
                    maxLength={255}
                    description="Max 255 characters"
                  />
                </div>
              </div>
            </div>

            {/* Info Column - Right Side */}
            <div className="space-y-6">
              {/* Info Tip */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-4">
                <Text className="text-sm text-blue-700">
                  <strong>💡 Tip:</strong> Types help categorize your blog posts
                  into different content categories. Examples: "blog-personal" for
                  personal blog posts, "teknologi" for technology articles,
                  "tutorial" for how-to guides.
                </Text>
              </div>

              {/* Usage Examples */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                <h4 className="text-sm font-semibold mb-2 text-gray-700">
                  Common Types:
                </h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• blog-personal</li>
                  <li>• teknologi</li>
                  <li>• tutorial</li>
                  <li>• news</li>
                  <li>• review</li>
                </ul>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
