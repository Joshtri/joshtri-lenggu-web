import { Suspense } from "react";
import SettingsContent from "@/components/features/settings/SettingsContent";

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 dark:bg-gray-900" />}>
      <SettingsContent />
    </Suspense>
  );
}
