"use client";

import React, { useState, useEffect } from "react";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
} from "@heroui/react";
import { UserButton, useUser } from "@clerk/nextjs";
import { Search, Sun, Moon, Menu, FileEdit, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { publicMenuItems, systemMenuItems } from "@/config/navigationItem";
import { textToSlug } from "@/lib/slug";

interface TypeItem {
  id: string;
  name: string;
}

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const [types, setTypes] = useState<TypeItem[]>([]);
  const [typesLoading, setTypesLoading] = useState(true);
  const router = useRouter();
  const { isSignedIn } = useUser();

  // Check theme on mount
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setTimeout(() => {
      setIsDark(isDarkMode);
    }, 100);
  }, []);

  // Fetch types for blog dropdown
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await fetch("/api/public/types");
        const result = await response.json();
        if (result.success) {
          setTypes(result.data);
        }
      } catch (error) {
        console.error("Error fetching types:", error);
      } finally {
        setTypesLoading(false);
      }
    };

    fetchTypes();
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle("dark");

    // Save preference
    if (newIsDark) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-b-2 border-dashed border-gray-300 dark:border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo & Navigation */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <NextLink
              href="/"
              className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <FileEdit className="w-6 h-6" />
              <span className="hidden sm:inline">Blog</span>
            </NextLink>

            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex items-center gap-1">
              {publicMenuItems.map((item) => {
                // Handle Blog item specially for dropdown
                if (item.key === "blog") {
                  return (
                    <Dropdown key={item.key} placement="bottom-start">
                      <DropdownTrigger>
                        <Button
                          variant="light"
                          className="text-sm text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors gap-1 h-auto px-3 py-2"
                          endContent={<ChevronDown className="w-4 h-4" />}
                        >
                          <div className="flex items-center gap-2">
                            {item.icon}
                            {item.label}
                          </div>
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label="Blog categories"
                        className="w-48"
                      >
                        {typesLoading ? (
                          <DropdownItem disabled>Loading...</DropdownItem>
                        ) : types.length === 0 ? (
                          <DropdownItem disabled>No categories</DropdownItem>
                        ) : (
                          types.map((type) => (
                            <DropdownItem
                              key={type.id}
                              onPress={() =>
                                router.push(`/${textToSlug(type.name)}`)
                              }
                              className="text-gray-900 dark:text-gray-100"
                            >
                              {type.name}
                            </DropdownItem>
                          ))
                        )}
                      </DropdownMenu>
                    </Dropdown>
                  );
                }

                return (
                  <NextLink
                    key={item.key}
                    href={item.href}
                    className="text-sm text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800/50"
                  >
                    {item.icon}
                    {item.label}
                  </NextLink>
                );
              })}
            </div>
          </div>

          {/* Right: Search, Theme Toggle, User */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <Button
              isIconOnly
              variant="light"
              aria-label="Search"
              className="text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800"
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* Mobile Menu - Dropdown */}
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button
                  isIconOnly
                  variant="light"
                  className="md:hidden text-gray-900 dark:text-gray-100"
                  aria-label="Menu"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Mobile menu">
                <DropdownSection title="Navigation">
                  {publicMenuItems.map((item) => {
                    // Handle Blog item with submenu
                    if (item.key === "blog") {
                      return (
                        <DropdownItem
                          key={item.key}
                          startContent={item.icon}
                          textValue={item.label}
                          className="font-semibold"
                        >
                          {item.label}
                        </DropdownItem>
                      );
                    }

                    return (
                      <DropdownItem
                        key={item.key}
                        startContent={item.icon}
                        onPress={() => router.push(item.href)}
                      >
                        {item.label}
                      </DropdownItem>
                    );
                  })}
                </DropdownSection>

                {/* Blog Categories in Mobile */}
                {!typesLoading && types.length > 0 && (
                  <DropdownSection title="Categories">
                    {types.map((type) => (
                      <DropdownItem
                        key={type.id}
                        onPress={() =>
                          router.push(`/${textToSlug(type.name)}`)
                        }
                      >
                        {type.name}
                      </DropdownItem>
                    ))}
                  </DropdownSection>
                )}

                {isSignedIn ? (
                  <DropdownSection title="System">
                    {systemMenuItems.map((item) => (
                      <DropdownItem
                        key={item.key}
                        startContent={item.icon}
                        onPress={() => router.push(item.href)}
                      >
                        {item.label}
                      </DropdownItem>
                    ))}
                  </DropdownSection>
                ) : null}
              </DropdownMenu>
            </Dropdown>

            {/* User Button */}
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9",
                },
              }}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
