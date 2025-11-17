"use client";

import { PageHeader } from "@/components/ui/Common/PageHeader";
import { InfoCard } from "@/components/ui/InfoCard";
import { ColorPickerInput } from "@/components/ui/Inputs/ColorPickerInput";
import { TextInput } from "@/components/ui/Inputs/TextInput";
import { TextareaInput } from "@/components/ui/Inputs/TextareaInput";
import { useCreateLabel, useUpdateLabel, useLabel } from "@/services/labelsService";
import { Button } from "@heroui/react";
import { Palette, Save, Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  CreateLabelInput,
  UpdateLabelInput,
} from "../interfaces/labels";
import { Text } from "@/components/ui/Text";
import EmptyState from "@/components/ui/Common/EmptyState";

type LabelFormData = {
  name: string;
  color: string;
  description?: string;
};

interface LabelFormProps {
  mode: "create" | "edit";
  labelId?: string;
}

export default function LabelForm({ mode, labelId }: LabelFormProps) {
  const router = useRouter();
  const isEdit = mode === "edit";

  // Fetch label data only in edit mode
  const { data: labelData, isLoading: labelLoading } = useLabel(
    labelId || ""
  );
  const label = isEdit && labelId ? labelData?.data : null;

  const methods = useForm<LabelFormData>({
    defaultValues: {
      name: "",
      color: "#3B82F6",
      description: "",
    },
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = methods;

  const createLabel = useCreateLabel();
  const updateLabel = useUpdateLabel();

  // Populate form when label data is loaded (edit mode only)
  useEffect(() => {
    if (isEdit && label) {
      reset({
        name: label.name,
        color: label.color,
        description: label.description || "",
      });
    }
  }, [label, reset, isEdit]);

  const onSubmit = async (data: LabelFormData) => {
    try {
      if (isEdit && labelId) {
        const updateData: UpdateLabelInput = {
          name: data.name,
          color: data.color.toUpperCase(),
          description: data.description || undefined,
        };
        await updateLabel.mutateAsync({ id: labelId, data: updateData });
        router.push("/labels");
      } else {
        const createData: CreateLabelInput = {
          name: data.name,
          color: data.color.toUpperCase(),
          description: data.description || undefined,
        };
        await createLabel.mutateAsync(createData);
        router.push("/labels");
      }
    } catch (error) {
      console.error(
        `Error ${isEdit ? "updating" : "creating"} label:`,
        error
      );
    }
  };

  if (isEdit && labelLoading) {
    return <></>;
  }

  if (isEdit && !label) {
    return (
      <EmptyState
        title={"Label not found"}
        description={"The label you are looking for does not exist."}
      />
    );
  }

  const isCreate = mode === "create";
  const cancelPath = "/labels";

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <PageHeader
        title={isCreate ? "Create New Label" : "Edit Label"}
        description={
          isCreate
            ? "Create labels to organize and categorize your blog posts."
            : "Update label information to keep your content organized."
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
                  ? "Creating..."
                  : "Updating..."
                : isCreate
                ? "Create Label"
                : "Update Label"}
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
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="p-4 bg-linear-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-750 border-b border-gray-200 dark:border-gray-700">
                  <Text className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                    <Tag className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    Label Information
                  </Text>
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
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-750 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                    <Palette className="h-5 w-5 text-purple-600 dark:text-purple-400" />
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
              <InfoCard type="tip" title="Tip">
                Choose a distinctive color for easy identification. Labels help
                categorize posts and make content easier to find.
              </InfoCard>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
