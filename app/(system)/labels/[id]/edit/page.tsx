"use client";

import LabelForm from "@/components/features/labels/components/LabelForm";
import { useParams } from "next/navigation";

export default function LabelsEditPage() {
  const { id } = useParams();

  return <LabelForm mode="edit" labelId={String(id)} />;
}
