"use client";

import TypeEdit from "@/components/features/types/edit";
import { useType } from "@/services/typesService";
import { useParams } from "next/navigation";
import { Spinner } from "@heroui/react";

export default function TypeEditPage() {
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading, isError, error } = useType(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Error</h2>
          <p className="text-gray-600 mt-2">
            {error instanceof Error ? error.message : "Failed to load type"}
          </p>
        </div>
      </div>
    );
  }

  return <TypeEdit initialData={data.data} />;
}
