"use client";

import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { PageHeader } from "@/components/ui/Common/PageHeader";
import { TextInput } from "@/components/ui/Inputs/TextInput";
import { TextareaInput } from "@/components/ui/Inputs/TextareaInput";
import { ColorPickerInput } from "@/components/ui/Inputs/ColorPickerInput";
import { Button } from "@heroui/react";
import { Save, X, Tag, Palette } from "lucide-react";
import { useCreateLabel, useUpdateLabel } from "@/services/labelsService";
import {
  CreateLabelInput,
  UpdateLabelInput,
  Label,
} from "../interfaces/labels";
import { Text } from "@/components/ui/Text";

type LabelFormData = {
  name: string;
  color: string;
  description?: string;
};

interface LabelFormProps {
  initialData?: Label;
  mode?: "create" | "update";
}

export default function LabelForm({
  initialData,
  mode = "create",
}: LabelFormProps) {
  const router = useRouter();
  const isUpdateMode = mode === "update" && initialData;

  const methods = useForm<LabelFormData>({
    defaultValues: {
      name: initialData?.name || "",
      color: initialData?.color || "#3B82F6",
      description: initialData?.description || "",
    },
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = methods;

  const createLabel = useCreateLabel();
  const updateLabel = useUpdateLabel();

  const onSubmit = async (data: LabelFormData) => {
    try {
      if (isUpdateMode) {
        const updateData: UpdateLabelInput = {
          name: data.name,
          color: data.color.toUpperCase(),
          description: data.description || undefined,
        };
        await updateLabel.mutateAsync({ id: initialData.id, data: updateData });
      } else {
        const createData: CreateLabelInput = {
          name: data.name,
          color: data.color.toUpperCase(),
          description: data.description || undefined,
        };
        await createLabel.mutateAsync(createData);
      }
      router.push("/sys/labels");
    } catch (error) {
      console.error(
        `Error ${isUpdateMode ? "updating" : "creating"} label:`,
        error
      );
    }
  };

  return (
    // <div className="min-h-screen">

    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title={isUpdateMode ? "Update Label" : "Create New Label"}
        description={
          isUpdateMode
            ? "Update label information to keep your content organized."
            : "Create labels to organize and categorize your blog posts."
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
              onPress={() => router.push("/labels")}
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
              {isSubmitting
                ? isUpdateMode
                  ? "Updating..."
                  : "Creating..."
                : isUpdateMode
                ? "Update Label"
                : "Create Label"}
            </Button>
          </>
        }
      />
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
            {/* Form Fields Column - Left Side */}
            <div className="lg:col-span-2 space-y-6">
              {/* Label Information Card */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Tag className="h-5 w-5 text-blue-600" />
                    Label Information
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  <TextInput
                    name="name"
                    label="Label Name"
                    placeholder="Enter a descriptive label name"
                    required
                    validation={{
                      required: "Label name is required",
                      minLength: {
                        value: 2,
                        message: "Label name must be at least 2 characters",
                      },
                      maxLength: {
                        value: 50,
                        message: "Label name must not exceed 50 characters",
                      },
                    }}
                  />

                  <TextareaInput
                    name="description"
                    label="Description"
                    placeholder="Add a brief description (optional)..."
                    required={false}
                    minRows={3}
                    maxLength={200}
                    description="Max 200 characters"
                  />
                </div>
              </div>
            </div>

            {/* Color Picker Column - Right Side */}
            <div className="space-y-6">
              {/* Label Color Card */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Palette className="h-5 w-5 text-purple-600" />
                    Label Color
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  <ColorPickerInput
                    name="color"
                    label="Color"
                    placeholder="#3B82F6"
                    required
                    helperText="Choose a color to visually identify this label"
                  />
                </div>
              </div>

              {/* Info Tip */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-4">
                <Text className="text-sm text-blue-700">
                  <strong>💡 Tip:</strong> Choose a distinctive color for easy
                  identification. Labels help categorize posts and make content
                  easier to find.
                </Text>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
    // </div>
  );
}
