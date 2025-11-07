"use client";

import TypeForm from "../create";
import { Type } from "../interfaces";

interface TypeEditProps {
  initialData: Type;
}

export default function TypeEdit({ initialData }: TypeEditProps) {
  return <TypeForm initialData={initialData} mode="update" />;
}
