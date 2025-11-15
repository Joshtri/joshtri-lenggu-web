"use client";

import { Tabs, Tab } from "@heroui/react";
import SiteSettings from "@/components/features/settings/site";
import MaintenanceSettings from "@/components/features/settings/maintenance";
import CommentSettings from "@/components/features/settings/comments";
import EmailSettings from "@/components/features/settings/email";
import ContentSettings from "@/components/features/settings/content";
import SocialMediaSettings from "@/components/features/settings/social";
import {
  Mail,
  MessageSquareText,
  Settings,
  TriangleAlert,
  FileText,
  Users,
} from "lucide-react";
import { Text } from "@/components/ui/Text";
import { Heading } from "@/components/ui/Heading";
import { InfoCard } from "@/components/ui/InfoCard";
import ShortcutsSettings from "@/components/features/settings/shortcuts";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function SettingsContent() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") || "site";
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  const tabItems = [
    {
      key: "site",
      icon: Settings,
      label: "Site Settings",
      Component: SiteSettings,
    },
    {
      key: "maintenance",
      icon: TriangleAlert,
      label: "Maintenance",
      Component: MaintenanceSettings,
    },
    {
      key: "comments",
      icon: MessageSquareText,
      label: "Comments",
      Component: CommentSettings,
    },
    { key: "email", icon: Mail, label: "Email", Component: EmailSettings },
    {
      key: "content",
      icon: FileText,
      label: "Content",
      Component: ContentSettings,
    },
    {
      key: "social",
      icon: Users,
      label: "Social Media",
      Component: SocialMediaSettings,
    },
    {
      key: "shortcuts",
      icon: Settings,
      label: "Shortcuts",
      Component: ShortcutsSettings,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <Heading className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
            Settings
          </Heading>
          <Text className="mt-2 text-sm lg:text-base text-gray-600 dark:text-gray-400">
            Manage your blog configuration and preferences
          </Text>
        </div>

        {/* Tabs Container */}
        <Tabs
          aria-label="Settings options"
          isVertical={isDesktop}
          defaultSelectedKey={defaultTab}
          classNames={{
            base: "flex flex-col lg:flex-row gap-4 lg:gap-4",
            tabList:
              "gap-2 lg:gap-3 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible lg:w-64 xl:w-72 lg:flex-shrink-0 relative rounded-lg p-2 lg:p-3 bg-white dark:bg-gray-800 shadow-sm",
            cursor: "bg-primary-100 dark:bg-primary-900/20",
            tab: "px-3 lg:px-4 h-10 lg:h-12 justify-start text-sm lg:text-base whitespace-nowrap lg:whitespace-normal",
            tabContent:
              "group-data-[selected=true]:text-primary-600 dark:group-data-[selected=true]:text-primary-400",
            panel:
              "w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm p-2  mx-3 sm:p-5 ",
          }}
        >
          {tabItems.map(({ key, icon: Icon, label, Component }) => (
            <Tab
              key={key}
              title={
                <div className="flex items-center gap-2 lg:gap-3">
                  <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span className="text-sm lg:text-base">{label}</span>
                </div>
              }
            >
              <Component />
            </Tab>
          ))}
        </Tabs>

        {/* Info Box */}
        <InfoCard
          className="mt-4 lg:mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 lg:p-4"
          title="Settings Info"
          type="info"
        >
          Changes are saved immediately when you click Save Changes button.
        </InfoCard>
      </div>
    </div>
  );
}
