"use client";

import { useDeleteLabel, useLabels } from "@/services/labelsService";
import { useRouter } from "next/navigation";
import React from "react";
import { Label } from "../interfaces/labels";
import { ListGrid } from "@/components/ui/ListGrid";
import { EyeIcon, PencilIcon, PlusIcon } from "lucide-react";
import { ACTION_BUTTONS, ADD_BUTTON } from "@/components/ui/Button/ActionButtons";

export default function LabelList() {
  const router = useRouter();

  const { data: dataLabels, isLoading, isError, error } = useLabels();
  const deleteLabel = useDeleteLabel();
  // const labels = data?.data || [];

  const columns = [
    {
      key: "id",
      label: "ID",
      value: (label: Label) => label.id,
    },
    {
      key: "name",
      label: "Name",
      value: (label: Label) => label.name,
    },
    {
      key: "color",
      label: "Color",
      value: (label: Label) => label.color,
    },
    {
      key: "description",
      label: "Description",
      value: (label: Label) => label.description,
    },
    {
      key: "actions",
      label: "Actions",
      align: "center" as const,
    },
  ];

  const handleDelete = (id: string) => {
    deleteLabel.mutateAsync(Number(id)).then(() => {
      // Router refresh will trigger re-fetch from cache
      router.refresh();
    });
  };

  return (
    <ListGrid
      keyField="id"
      idField="id"
      title={"Label Management"}
      description={"Manage your labels"}
      // addButton={{
      //   label: "Tambah Label",
      //   href: "/labels/create",
      //   icon: <PlusIcon className="w-4 h-4" />,
      // }}
      actionButtons={{
        add: ADD_BUTTON.CREATE("/labels/create"),
        show: ACTION_BUTTONS.SHOW((id) => router.push(`/labels/${id}`)),
        edit: ACTION_BUTTONS.EDIT((id) => router.push(`/labels/${id}/edit`)),
        delete: ACTION_BUTTONS.DELETE(handleDelete),
      }}
      isError={isError}
      error={error}
      loading={isLoading}
      empty={dataLabels?.data?.length === 0}
      nameField="name"
      searchPlaceholder="Search labels by name, description, or color..."
      data={dataLabels}
      onSearch={(query) => {}}
      columns={columns as never}
      pageSize={10}
      showPagination={true}
    />
  );
}
