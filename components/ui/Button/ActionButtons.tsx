/**
 * Pre-built action buttons for ListGrid
 * Makes it easy to create common CRUD actions
 */

import { Eye, Pencil, Trash2, Plus } from "lucide-react";
import { ReactNode } from "react";
import { LinkButton } from "./LinkButton";

// import { LinkButton } from "../Button";

export interface ActionButtonConfig {
  show?: {
    href?: string;
    onClick?: (id: string) => void;
    label?: string;
    icon?: ReactNode;
  };
  edit?: {
    href?: string;
    onClick?: (id: string) => void;
    label?: string;
    icon?: ReactNode;
  };
  delete?: {
    onDelete: (id: string, item?: string | unknown) => void;
    label?: string;
    icon?: ReactNode;
    confirmMessage?: (item: string | unknown) => string;
  };
  custom?: Array<{
    key: string;
    label: string;
    icon?: ReactNode;
    color?:
      | "default"
      | "primary"
      | "secondary"
      | "success"
      | "warning"
      | "danger";
    variant?:
      | "solid"
      | "bordered"
      | "light"
      | "flat"
      | "faded"
      | "shadow"
      | "ghost";
    onClick?: (id: string, item?: unknown) => void;
    href?: string;
  }>;
}

export interface AddButtonConfig {
  href: string;
  label?: string;
  icon?: ReactNode;
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  variant?:
    | "solid"
    | "bordered"
    | "light"
    | "flat"
    | "faded"
    | "shadow"
    | "ghost";
}

/**
 * Create action buttons for table rows
 */
export const createActionButtons = (
  config: ActionButtonConfig,
  openDeleteDialog: (id: string, item: unknown) => void
) => {
  type RowLike = { id: string; [key: string]: unknown };

  const renderRowActions = (item: RowLike) => {
    const buttons: ReactNode[] = [];

    // Show/View button
    if (config.show) {
      if (config.show.onClick) {
        buttons.push(
          <button
            key="show"
            className="text-blue-600 hover:text-blue-700 transition-colors p-1.5 rounded-md hover:bg-blue-50"
            onClick={() => config.show?.onClick?.(item.id)}
            title={config.show.label || "Detail"}
          >
            {config.show.icon || <Eye className="w-4 h-4" />}
          </button>
        );
      } else {
        const showHref = config.show.href || "#";
        buttons.push(
          <LinkButton
            key="show"
            color="primary"
            href={showHref}
            size="sm"
            startContent={config.show.icon || <Eye className="w-4 h-4" />}
            variant="light"
          >
            {config.show.label || "Detail"}
          </LinkButton>
        );
      }
    }

    // Edit button
    if (config.edit) {
      if (config.edit.onClick) {
        buttons.push(
          <button
            key="edit"
            className="text-yellow-600 hover:text-yellow-700 transition-colors p-1.5 rounded-md hover:bg-yellow-50"
            onClick={() => config.edit?.onClick?.(item.id)}
            title={config.edit.label || "Edit"}
          >
            {config.edit.icon || <Pencil className="w-4 h-4" />}
          </button>
        );
      } else {
        const editHref = config.edit.href || "#";
        buttons.push(
          <LinkButton
            key="edit"
            color="warning"
            href={editHref}
            size="sm"
            startContent={config.edit.icon || <Pencil className="w-4 h-4" />}
            variant="light"
          >
            {config.edit.label || "Edit"}
          </LinkButton>
        );
      }
    }

    // Custom buttons
    if (config.custom) {
      config.custom.forEach((customBtn) => {
        if (customBtn.href) {
          const customHref = customBtn.href || "#";
          buttons.push(
            <LinkButton
              key={customBtn.key}
              color={customBtn.color || "default"}
              href={customHref}
              size="sm"
              startContent={customBtn.icon}
              variant={customBtn.variant || "light"}
            >
              {customBtn.label}
            </LinkButton>
          );
        } else if (customBtn.onClick) {
          buttons.push(
            <button
              key={customBtn.key}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                customBtn.color === "danger"
                  ? "text-red-600 hover:bg-red-50"
                  : customBtn.color === "warning"
                  ? "text-yellow-600 hover:bg-yellow-50"
                  : customBtn.color === "success"
                  ? "text-green-600 hover:bg-green-50"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => customBtn.onClick?.(item.id, item)}
            >
              {customBtn.icon && (
                <span className="inline-block mr-1">{customBtn.icon}</span>
              )}
              {customBtn.label}
            </button>
          );
        }
      });
    }

    // Delete button
    if (config.delete) {
      buttons.push(
        <button
          key="delete"
          className="text-red-600 hover:text-red-700 transition-colors p-1.5 rounded-md hover:bg-red-50"
          title={config.delete.label || "Hapus"}
          onClick={() => openDeleteDialog(item.id, item)}
        >
          {config.delete.icon || <Trash2 className="w-4 h-4" />}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-center gap-2">{buttons}</div>
    );
  };

  return renderRowActions;
};

/**
 * Create add/create button for header actions
 */
export const createAddButton = (config: AddButtonConfig) => {
  return (
    <LinkButton
      color={config.color || "primary"}
      href={config.href}
      size="md"
      startContent={config.icon || <Plus className="w-4 h-4" />}
      variant={config.variant || "solid"}
    >
      {config.label || "Tambah"}
    </LinkButton>
  );
};
