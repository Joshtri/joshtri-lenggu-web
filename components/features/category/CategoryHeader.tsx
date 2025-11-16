"use client";

import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { BreadcrumbItem, Breadcrumbs, Button } from "@heroui/react";
import { ArrowLeft, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Type } from "../types/interfaces";
import { iconMap } from "@/components/ui/customIcons";

interface CategoryHeaderProps {
  type: Type;
  slug: string;
  postsCount: number;
  onSearchClick?: () => void;
}

export default function CategoryHeader({
  type,
  slug,
  postsCount,
  onSearchClick,
}: CategoryHeaderProps) {
  const router = useRouter();
  const Icon = iconMap[slug] || iconMap["personal-blog"];

  return (
    <section className="bg-white dark:bg-gray-950 border-b-2 border-dashed border-gray-300 dark:border-gray-700">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <Button
              isIconOnly
              variant="light"
              onPress={() => router.back()}
              className="dark:text-gray-200"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Breadcrumbs
              separator={
                <span className="mx-2 text-gray-500 dark:text-gray-400">/</span>
              }
              classNames={{
                base: "flex items-center text-sm",
                separator: "text-gray-500 dark:text-gray-400",
              }}
            >
              <BreadcrumbItem>
                <Link
                  href="/"
                  className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  Home
                </Link>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrent>{type.name}</BreadcrumbItem>
            </Breadcrumbs>
          </div>

          {/* Search Button */}
          {onSearchClick && (
            <Button
              isIconOnly
              variant="light"
              onPress={onSearchClick}
              className="dark:text-gray-200"
              title="Search in this category (Ctrl+K)"
            >
              <Search className="h-5 w-5" />
            </Button>
          )}
        </div>

        <div className="flex items-start gap-6">
          <div className="inline-flex items-center justify-center w-24 h-24 border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-full flex-shrink-0">
            <Icon className={slug === 'personal-blog' || slug === 'personal' ? 'h-20 w-20' : 'h-12 w-12 text-gray-900 dark:text-white'} />
          </div>
          <div>
            <Heading className="text-5xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
              {type.name}
            </Heading>
            {type.description && (
              <Text className="text-xl text-gray-600 dark:text-gray-400 font-light">
                {type.description}
              </Text>
            )}
            <Text className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              {postsCount} article{postsCount !== 1 ? "s" : ""}
            </Text>
          </div>
        </div>
      </div>
    </section>
  );
}
