"use client";

import { ADD_BUTTON } from "@/components/ui/Button/ActionButtons";
import { Heading } from "@/components/ui/Heading";
import { SwitchInput, TextInput } from "@/components/ui/Inputs";
import { Columns, ListGrid } from "@/components/ui/ListGrid";
import { Text } from "@/components/ui/Text";
import { Shortcut, ShortcutService } from "@/services/shortcutService";
import {
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { ExternalLink } from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

interface CreateShortcutInput {
  name: string;
  url: string;
  description?: string;
  icon?: string;
  isActive: boolean;
}

export default function ShortcutsSettings() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [editingShortcut, setEditingShortcut] = useState<Shortcut | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<CreateShortcutInput>({
    defaultValues: {
      name: "",
      url: "",
      description: "",
      icon: "",
      isActive: true,
    },
  });

  const { handleSubmit, reset } = methods;

  const columns: Columns<Shortcut> = [
    {
      key: "name",
      label: "Name",
      value: (shortcut: Shortcut) => (
        <div className="flex items-center gap-2">
          {shortcut.icon && <span className="text-xl">{shortcut.icon}</span>}
          <span className="font-medium">{shortcut.name}</span>
        </div>
      ),
    },
    {
      key: "url",
      label: "URL",
      value: (shortcut: Shortcut) => (
        <a
          href={shortcut.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-primary hover:underline"
        >
          <span className="truncate max-w-xs">{shortcut.url}</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      ),
    },
    {
      key: "description",
      label: "Description",
      value: (shortcut: Shortcut) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {shortcut.description || "-"}
        </span>
      ),
    },
    {
      key: "isActive",
      label: "Status",
      value: (shortcut: Shortcut) => (
        <Chip
          color={shortcut.isActive ? "success" : "default"}
          variant="flat"
          size="sm"
        >
          {shortcut.isActive ? "Active" : "Inactive"}
        </Chip>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "center" as const,
    },
  ];

  const handleDelete = async (id: string) => {
    try {
      await ShortcutService.deleteShortcut(id);
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete shortcut:", error);
      throw error;
    }
  };

  const handleEdit = (id: string, item: unknown) => {
    const shortcut = item as Shortcut;
    setEditingShortcut(shortcut);
    reset({
      name: shortcut.name,
      url: shortcut.url,
      description: shortcut.description || "",
      icon: shortcut.icon || "",
      isActive: shortcut.isActive,
    });
    onOpen();
  };

  const onSubmit = async (data: CreateShortcutInput) => {
    setIsSubmitting(true);
    try {
      if (editingShortcut) {
        await ShortcutService.updateShortcut(editingShortcut.id, data);
      } else {
        await ShortcutService.createShortcut(data);
      }
      onClose();
      reset();
      window.location.reload();
    } catch (error) {
      console.error("Failed to save shortcut:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <Heading className="text-xl md:text-2xl font-bold">
          Shortcut Settings
        </Heading>
        <Text className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
          Manage your quick access shortcuts
        </Text>
      </div>

      <ListGrid
        keyField="id"
        idField="id"
        title="Shortcuts"
        description="Quick access links to important pages"
        withoutBreadcrumbs={true}
        actionButtons={{
          add: ADD_BUTTON.CREATE("/settings/shortcuts/create"),
        }}
        resourcePath="/shortcuts"
        nameField="name"
        searchPlaceholder="Search shortcuts..."
        columns={columns}
        pageSize={10}
        showPagination={true}
      />

      {/* Create/Edit Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <ModalHeader>
                  <Heading className="text-lg font-semibold">
                    {editingShortcut ? "Edit Shortcut" : "Add Shortcut"}
                  </Heading>
                </ModalHeader>
                <ModalBody className="space-y-4">
                  <TextInput
                    name="name"
                    label="Name"
                    placeholder="Enter shortcut name"
                    required
                  />

                  <TextInput
                    name="url"
                    label="URL"
                    placeholder="https://example.com"
                    required
                  />

                  <TextInput
                    name="description"
                    label="Description"
                    placeholder="Enter description (optional)"
                  />

                  <TextInput
                    name="icon"
                    label="Icon (Emoji)"
                    placeholder="🔗"
                  />

                  <div className="flex items-center justify-between">
                    <div>
                      <Heading className="text-base font-semibold">
                        Active
                      </Heading>
                      <Text className="text-sm text-gray-600 dark:text-gray-400">
                        Enable this shortcut
                      </Text>
                    </div>
                    <SwitchInput name="isActive" color="primary" size="lg" />
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    type="submit"
                    isLoading={isSubmitting}
                  >
                    {editingShortcut ? "Update" : "Create"}
                  </Button>
                </ModalFooter>
              </form>
            </FormProvider>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
