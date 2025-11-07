"use client";

import { useDeleteType, useTypes } from "@/services/typesService";
import { useRouter } from "next/navigation";
import React from "react";
import { Type } from "../interfaces";
import { ListGrid } from "@/components/ui/ListGrid";
import { EyeIcon, PencilIcon, PlusIcon } from "lucide-react";
import { ACTION_BUTTONS, ADD_BUTTON } from "@/components/ui/Button/ActionButtons";

export default function TypeList() {
  const router = useRouter();

  const { data, isLoading, isError, error } = useTypes();
  const deleteType = useDeleteType();
  const types = data?.data || [];

  const columns = [
    {
      key: "id",
      label: "ID",
      value: (type: Type) => type.id,
    },
    {
      key: "name",
      label: "Name",
      value: (type: Type) => type.name,
    },
    {
      key: "description",
      label: "Description",
      value: (type: Type) => type.description || "-",
    },
    {
      key: "actions",
      label: "Actions",
      align: "center" as const,
    },
  ];

  const handleDelete = (id: string) => {
    deleteType.mutateAsync(id).then(() => {
      // Router refresh will trigger re-fetch from cache
      router.refresh();
    });
  };

  return (
    <ListGrid
      keyField="id"
      idField="id"
      title={"Type Management"}
      description={"Manage content types for your blog posts"}
      actionButtons={{
        add: ADD_BUTTON.CREATE("/types/create"),
        show: ACTION_BUTTONS.SHOW((id) => router.push(`/types/${id}`)),
        edit: ACTION_BUTTONS.EDIT((id) => router.push(`/types/${id}/edit`)),
        delete: ACTION_BUTTONS.DELETE(handleDelete),
      }}
      isError={isError}
      error={error}
      loading={isLoading}
      empty={types.length === 0}
      nameField="name"
      searchPlaceholder="Search types by name or description..."
      data={types}
      onSearch={(query) => {}}
      columns={columns as never}
      pageSize={10}
      showPagination={true}
    />
  );
}
