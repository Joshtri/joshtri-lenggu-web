"use client";

import {
  ACTION_BUTTONS,
  ADD_BUTTON,
} from "@/components/ui/Button/ActionButtons";
import { Heading } from "@/components/ui/Heading";
import { Columns, ListGrid } from "@/components/ui/ListGrid";
import { Text } from "@/components/ui/Text";
import { Shortcut, ShortcutService } from "@/services/shortcutService";
import { Button, Chip } from "@heroui/react";
import { ExternalLink, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ShortcutsSettings() {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const router = useRouter();

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
    if (
      !window.confirm(
        "Are you sure you want to delete this shortcut? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(id);
    try {
      await ShortcutService.deleteShortcut(id);
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete shortcut:", error);
      setIsDeleting(null);
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
          // edit: ACTION_BUTTONS.EDIT("/settings/shortcuts"),
          edit: ACTION_BUTTONS.EDIT((id) => router.push(`/settings/shortcuts/${id}/edit`)),

          delete: ACTION_BUTTONS.DELETE(handleDelete),
          show: ACTION_BUTTONS.SHOW("/settings/shortcuts"),
          // view: ACTION_BUTTONS.VIEW("/settings/shortcuts/[id]"),
        }}
        resourcePath="/shortcuts"
        useExternalAPI={true}
        nameField="name"
        searchPlaceholder="Search shortcuts..."
        columns={columns}
        pageSize={10}
        showPagination={true}
      />
    </div>
  );
}
