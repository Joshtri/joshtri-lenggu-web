"use client";

import { PageHeader } from "@/components/ui/Common/PageHeader";
import { Heading } from "@/components/ui/Heading";
import { SwitchInput, TextInput } from "@/components/ui/Inputs";
import { Text } from "@/components/ui/Text";
import { Shortcut, ShortcutService } from "@/services/shortcutService";
import { Button, Card, CardBody } from "@heroui/react";
import { Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

interface ShortcutFormData {
  name: string;
  url: string;
  description?: string;
  icon: string;
  isActive: boolean;
}

interface ShortcutEditProps {
  shortcutId: string;
}

export default function ShortcutEdit({ shortcutId }: ShortcutEditProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [shortcut, setShortcut] = useState<Shortcut | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const methods = useForm<ShortcutFormData>({
    defaultValues: {
      name: "",
      url: "",
      description: "",
      icon: "",
      isActive: true,
    },
  });

  const {
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = methods;

  // Fetch shortcut data
  useEffect(() => {
    const fetchShortcut = async () => {
      try {
        setIsLoading(true);
        const data = await ShortcutService.getShortcutById(shortcutId);
        if (!data) {
          router.push("/settings/shortcuts");
          return;
        }
        setShortcut(data);
        reset({
          name: data.name,
          url: data.url,
          description: data.description || "",
          icon: data.icon || "",
          isActive: data.isActive,
        });
      } catch (error) {
        console.error("Error fetching shortcut:", error);
        router.push("/settings/shortcuts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchShortcut();
  }, [shortcutId, router, reset]);

  const onSubmit = async (data: ShortcutFormData) => {
    setIsSubmitting(true);
    try {
      await ShortcutService.updateShortcut(shortcutId, data);
      console.log("✅ Shortcut updated successfully!");
      router.push("/settings/shortcuts");
    } catch (error) {
      console.error("Error updating shortcut:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to update shortcut. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this shortcut? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);
    try {
      await ShortcutService.deleteShortcut(shortcutId);
      console.log("✅ Shortcut deleted successfully!");
      router.push("/settings/shortcuts");
    } catch (error) {
      console.error("Error deleting shortcut:", error);
      const message =
        error instanceof Error ? error.message : "Failed to delete shortcut";
      setDeleteError(message);
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Text>Loading shortcut...</Text>
      </div>
    );
  }

  if (!shortcut) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Text>Shortcut not found</Text>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Edit Shortcut"
        description="Update the shortcut details and settings."
        breadcrumbs={[
          { label: "Settings", href: "/settings" },
          { label: "Shortcuts", href: "/settings/shortcuts" },
          { label: "Edit" },
        ]}
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
              isDisabled={isSubmitting || isDeleting}
              onPress={() => router.push("/settings/shortcuts")}
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
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </>
        }
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardBody className="p-6 space-y-4">
                <div>
                  <Heading className="text-lg font-semibold mb-1">
                    Basic Information
                  </Heading>
                  <Text className="text-sm text-gray-600 dark:text-gray-400">
                    Update the shortcut details
                  </Text>
                </div>

                <TextInput
                  name="name"
                  label="Name"
                  placeholder="Enter shortcut name"
                  required
                  errorMessage={errors.name?.message}
                />

                <TextInput
                  name="url"
                  label="URL"
                  placeholder="https://example.com"
                  required
                  errorMessage={errors.url?.message}
                />

                <TextInput
                  name="description"
                  label="Description"
                  placeholder="Enter description (optional)"
                  errorMessage={errors.description?.message}
                />

                <TextInput
                  name="icon"
                  label="Icon (Emoji)"
                  placeholder="🔗"
                  errorMessage={errors.icon?.message}
                />
              </CardBody>
            </Card>

            {/* Status */}
            <Card>
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Heading className="text-base font-semibold">
                      Active Status
                    </Heading>
                    <Text className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Enable this shortcut to make it visible
                    </Text>
                  </div>
                  <SwitchInput name="isActive" color="primary" size="lg" />
                </div>
              </CardBody>
            </Card>

            {/* Delete Section */}
            <Card className="border-red-200 dark:border-red-900">
              <CardBody className="p-6 space-y-4">
                <div>
                  <Heading className="text-lg font-semibold text-red-600 dark:text-red-400 mb-1">
                    Danger Zone
                  </Heading>
                  <Text className="text-sm text-gray-600 dark:text-gray-400">
                    Delete this shortcut permanently
                  </Text>
                </div>

                {deleteError && (
                  <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md p-3">
                    <Text className="text-sm text-red-600 dark:text-red-400">
                      {deleteError}
                    </Text>
                  </div>
                )}

                <Button
                  color="danger"
                  variant="bordered"
                  isLoading={isDeleting}
                  isDisabled={isSubmitting}
                  onPress={handleDelete}
                  startContent={!isDeleting && <Trash2 className="h-4 w-4" />}
                  className="w-full"
                >
                  {isDeleting ? "Deleting..." : "Delete Shortcut"}
                </Button>
              </CardBody>
            </Card>

            {/* Tips Card */}
            <Card>
              <CardBody className="p-6 bg-blue-50 dark:bg-blue-950">
                <div className="space-y-2">
                  <Heading className="text-base font-semibold text-blue-900 dark:text-blue-100">
                    💡 Tips for Editing Shortcuts
                  </Heading>
                  <ul className="text-sm text-blue-700 dark:text-blue-200 space-y-1 list-disc list-inside">
                    <li>Use a clear and descriptive name</li>
                    <li>Make sure the URL is valid and accessible</li>
                    <li>Use emojis as icons for better visual identification</li>
                    <li>Add descriptions to provide context for each shortcut</li>
                  </ul>
                </div>
              </CardBody>
            </Card>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
