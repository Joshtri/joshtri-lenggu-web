"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Pagination,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { EllipsisIcon, FileText } from "lucide-react";

import SearchBar from "@/components/ui/SearchBar";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ConfirmDialog } from "./Common/ConfirmDialog";
import { SkeletonTable } from "./Skeletons/SkeletonTable";
import { PageHeader } from "./Common/PageHeader";
import {
  createActionButtons,
  createAddButton,
  AddButtonConfig,
  ActionButtonConfig,
} from "./Button/ActionButtons";
import { ErrorState } from "./Common/ErrorState";
import EmptyState from "./Common/EmptyState";

interface Column {
  key: string;
  label: string;
  align?: "start" | "center" | "end";
  value?: (item: Row) => ReactNode; // Optional value renderer
}

interface Row {
  key: string;
  [key: string]: string | number | boolean | ReactNode | undefined;
}

interface OptionsMenuItem {
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
  variant?: "solid" | "bordered" | "light" | "flat" | "faded" | "shadow";
  onPress?: () => void;
}

interface ListGridProps {
  title: string;
  description?: string;
  breadcrumbs?: { label: string; href?: string }[];

  // Simplified action buttons
  addButton?: AddButtonConfig;
  actionButtons?: ActionButtonConfig;

  // Or use custom actions (old way)
  actions?: ReactNode;

  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  columns: Column[];

  // NEW! Auto-mapping: pass raw data array instead of manually mapping rows
  data?: unknown[];
  keyField?: string; // Field to use as React key (default: "id")
  idField?: string; // Field to use as id for actions (default: "id")
  nameField?: string; // Field to use in delete confirmation (default: "name")

  // Or manually provide rows (old way)
  rows?: Row[];

  loading?: boolean;
  empty?: ReactNode;
  isError?: boolean;
  error?: { message?: string } | Error | null;
  onOptionsClick?: () => void | ReactNode;
  optionsMenu?: OptionsMenuItem[];
  pageSize?: number;
  showPagination?: boolean;
  isMobile?: boolean;

  // Delete confirmation
  deleteConfirmTitle?: string;
  deleteConfirmMessage?: (item: unknown) => string;
}

export function ListGrid({
  title,
  description,
  breadcrumbs,
  addButton,
  actionButtons,
  actions: customActions,
  searchPlaceholder = "Cari...",
  onSearch,
  columns,
  isError,
  error,
  data,
  keyField = "id",
  idField = "id",
  nameField = "name",
  rows: manualRows,
  loading = false,
  empty,
  onOptionsClick,
  optionsMenu = [],
  pageSize = 10,
  showPagination = true,
  isMobile: isMobileProp,
  deleteConfirmTitle = "Konfirmasi Hapus",
  deleteConfirmMessage = (item: unknown) =>
    `Apakah Anda yakin ingin menghapus "${
      (item as { name?: string })?.name || "item ini"
    }"?`,
}: ListGridProps) {
  const isMobileDevice = useMediaQuery("maxWidth: 768px");
  const isMobile = isMobileProp ?? isMobileDevice;

  // Auto-transform data to rows if data prop is provided
  const rows = useMemo(() => {
    if (data) {
      // Automatically map data array to rows
      return data.map((item) => {
        const record = item as Record<string, string | number | boolean>;
        return {
          key: String(record[keyField] ?? ""),
          id: String(record[idField] ?? ""),
          name: String(record[nameField] ?? ""),
          ...record, // Spread all data for column value functions
        } as Row;
      });
    }

    // Use manually provided rows
    return manualRows ?? [];
  }, [data, manualRows, keyField, idField, nameField]);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);

  // Delete confirmation dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    item: Row;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (id: string, item: Row) => {
    setItemToDelete({ id, item });
    setIsDeleteDialogOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!itemToDelete || !actionButtons?.delete) return;

    setIsDeleting(true);

    try {
      await actionButtons.delete.onDelete(itemToDelete.id, itemToDelete.item);
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Create action buttons renderer
  const renderActions = useMemo(() => {
    if (actionButtons) {
      return createActionButtons(actionButtons, openDeleteDialog);
    }

    return null;
  }, [actionButtons]);

  // Create add button
  const renderAddButton = useMemo(() => {
    if (addButton) {
      return createAddButton(addButton);
    }

    return null;
  }, [addButton]);

  // Transform rows to include column values and actions
  const transformedRows = useMemo(() => {
    return rows.map((row) => {
      const transformedRow: Record<
        string,
        ReactNode | string | number | boolean | undefined
      > = { ...row };

      // Apply column value functions if defined
      columns.forEach((column) => {
        if (column.value && column.key !== "actions") {
          transformedRow[column.key] = column.value(row);
        }
      });

      // Add action buttons if configured
      if (renderActions) {
        transformedRow.actions = renderActions(row);
      }

      return transformedRow;
    });
  }, [rows, columns, renderActions]);

  const filteredRows = useMemo(() => {
    let filtered = [...transformedRows];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();

      filtered = filtered.filter((row) =>
        Object.values(row).some(
          (val) => typeof val === "string" && val.toLowerCase().includes(q)
        )
      );
    }

    if (sortKey) {
      filtered.sort((a, b) => {
        const valA = a[sortKey]?.toString().toLowerCase() ?? "";
        const valB = b[sortKey]?.toString().toLowerCase() ?? "";

        if (valA < valB) return sortDirection === "asc" ? -1 : 1;
        if (valA > valB) return sortDirection === "asc" ? 1 : -1;

        return 0;
      });
    }

    return filtered;
  }, [transformedRows, searchQuery, sortKey, sortDirection]);

  const totalPages = Math.ceil(filteredRows.length / pageSize);
  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;

    return filteredRows.slice(startIndex, startIndex + pageSize);
  }, [filteredRows, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, rows]);

  const renderMobileCard = (item: Row, _index: number) => {
    return (
      <div
        key={item.key}
        className="relative bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
      >
        {/* Blue top border */}
        <div className="h-1 bg-blue-500" />

        <div className="p-4 space-y-3">
          {columns
            .filter((col) => col.key !== "actions")
            .map((column, columnIndex) => (
              <div
                key={`${item.key}-${column.key}`}
                className={`flex flex-col ${
                  columnIndex !== columns.length - 2
                    ? "pb-3 border-b border-gray-100"
                    : ""
                }`}
              >
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  {column.label}
                </div>
                <div className="text-sm text-gray-900 font-medium">
                  {typeof item[column.key] === "object" &&
                  item[column.key] !== null
                    ? item[column.key]
                    : getKeyValue(item, column.key) || "-"}
                </div>
              </div>
            ))}

          {/* Actions for mobile */}
          {item.actions && (
            <div className="flex justify-end pt-2 border-t border-gray-100">
              {item.actions}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderMobileSkeleton = () => (
    <div className="space-y-4">
      {Array.from({ length: pageSize }).map((_, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
        >
          <div className="h-1 bg-gray-200 animate-pulse" />
          <div className="p-4 space-y-3">
            {columns.map((_, columnIndex) => (
              <div
                key={columnIndex}
                className={`${
                  columnIndex !== columns.length - 1
                    ? "pb-3 border-b border-gray-100"
                    : ""
                }`}
              >
                <div className="h-3 bg-gray-200 rounded w-1/3 mb-2 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderOptionsMenu = () => {
    if (optionsMenu.length === 0) return null;

    return (
      <Dropdown>
        <DropdownTrigger>
          <Button isIconOnly size="sm" variant="light">
            <EllipsisIcon className="w-5 h-5" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Options menu"
          onAction={(key) => {
            const menuItem = optionsMenu.find((item) => item.key === key);

            if (menuItem && menuItem.onPress) {
              menuItem.onPress();
            }
          }}
        >
          {optionsMenu.map((item) => (
            <DropdownItem
              key={item.key}
              color={item.color}
              startContent={item.icon}
              variant={item.variant}
            >
              {item.label}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    );
  };


  if (isError) {
    return (
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <PageHeader
          breadcrumbs={breadcrumbs}
          title={title}
          description={description}
        />
        <ErrorState
          title="Gagal Memuat Data"
          message={error?.message || "Terjadi kesalahan tak dikenal."}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }
  return (
    <>
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <PageHeader
          actions={
            <div className="flex items-center gap-2">
              {!isMobile && renderOptionsMenu()}
              {renderAddButton || customActions}
            </div>
          }
          breadcrumbs={breadcrumbs}
          description={description}
          title={title}
          onOptionsClick={onOptionsClick}
        />

        {onSearch && (
          <SearchBar
            placeholder={searchPlaceholder}
            onSearch={(val) => {
              setSearchQuery(val);
              onSearch?.(val);
            }}
          />
        )}

        {loading ? (
          isMobile ? (
            renderMobileSkeleton()
          ) : (
            <SkeletonTable columns={columns.length} rows={pageSize} />
          )
        ) : filteredRows.length === 0 ? (
          empty ?? (
            // <div className="text-center py-12">
            //   <div className="text-gray-400 text-sm">Data kosong.</div>
            // </div>
            <>
              <EmptyState
                title="Data kosong"
                description="Tidak ada data yang ditemukan."
                icon={<FileText className="w-12 h-12" />}
              />
            </>
          )
        ) : isMobile ? (
          <div className="space-y-4">
            <div className="grid gap-4">
              {paginatedRows.map((item, index) =>
                renderMobileCard(item, index)
              )}
            </div>

            {showPagination && totalPages > 1 && (
              <div className="flex justify-center pt-4">
                <Pagination
                  showControls
                  showShadow
                  classNames={{
                    wrapper: "gap-1",
                    item: "w-8 h-8 text-small",
                    cursor: "font-bold",
                  }}
                  color="primary"
                  page={currentPage}
                  total={totalPages}
                  onChange={onPageChange}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <Table aria-label="Tabel">
              <TableHeader columns={columns}>
                {(column) => (
                  <TableColumn
                    key={column.key}
                    align={column.align ?? "start"}
                    className="cursor-pointer select-none hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => handleSort(column.key)}
                  >
                    {column.label}
                    {sortKey === column.key &&
                      (sortDirection === "asc" ? " ▲" : " ▼")}
                  </TableColumn>
                )}
              </TableHeader>
              <TableBody items={paginatedRows}>
                {(item) => (
                  <TableRow
                    key={String(item.key)}
                    // key={item.key}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    {(columnKey) => (
                      <TableCell>
                        {typeof item[columnKey] === "object" &&
                        item[columnKey] !== null
                          ? item[columnKey]
                          : getKeyValue(item, columnKey)}
                      </TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {showPagination && totalPages > 1 && (
              <div className="flex justify-center pt-4">
                <Pagination
                  showControls
                  showShadow
                  classNames={{
                    wrapper: "gap-2",
                    item: "w-8 h-8 text-small",
                    cursor: "font-bold",
                  }}
                  color="primary"
                  page={currentPage}
                  total={totalPages}
                  onChange={onPageChange}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        confirmLabel="Hapus"
        isLoading={isDeleting}
        isOpen={isDeleteDialogOpen}
        message={
          itemToDelete
            ? deleteConfirmMessage(itemToDelete.item)
            : "Apakah Anda yakin?"
        }
        title={deleteConfirmTitle}
        onClose={() => {
          if (!isDeleting) {
            setIsDeleteDialogOpen(false);
            setItemToDelete(null);
          }
        }}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
