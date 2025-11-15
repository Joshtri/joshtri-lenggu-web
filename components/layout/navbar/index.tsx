"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
} from "@heroui/react";
import { UserButton, useUser } from "@clerk/nextjs";
import { Search, Sun, Moon, Menu, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { publicMenuItems, systemMenuItems } from "@/config/navigationItem";
import { textToSlug } from "@/lib/slug";
import { SearchModal } from "@/components/features/search/SearchModal";
import { useSearchContext } from "@/providers/SearchProvider";
import { Text } from "@/components/ui/Text";
import AuthButtons from "./AuthButtons";

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
  const { setIsOpen: openSearch } = useSearchContext();

  // Check and load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    // Use saved theme if available, otherwise use system preference
    const shouldBeDark = savedTheme === "dark" || (!savedTheme && prefersDark);

    setIsDark(shouldBeDark);

    // Apply theme to document - only if it doesn't match current state
    const htmlElement = document.documentElement;
    if (shouldBeDark && !htmlElement.classList.contains("dark")) {
      htmlElement.classList.add("dark");
    } else if (!shouldBeDark && htmlElement.classList.contains("dark")) {
      htmlElement.classList.remove("dark");
    }
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
    <>
      <SearchModal />
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
                {/* Logo - Solid for dark mode, Outlined for light mode */}
                {isDark ? (
                  <Image
                    src="/joshtri-lenggu-solid.png"
                    alt="Joshtri Lenggu"
                    width={192}
                    height={192}
                    quality={100}
                    priority={true}
                    className="w-12 h-12 object-contain"
                  />
                ) : (
                  <Image
                    src="/joshtri-lenggu-outlined.png"
                    alt="Joshtri Lenggu"
                    width={192}
                    height={192}
                    quality={100}
                    priority={true}
                    className="w-12 h-12 object-contain"
                  />
                )}
                <Text className="hidden sm:inline">JOSHTRI LENGGU</Text>
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
                            <DropdownItem key="loading" isDisabled>
                              Loading...
                            </DropdownItem>
                          ) : types.length === 0 ? (
                            <DropdownItem key="no-types" isDisabled>
                              No categories
                            </DropdownItem>
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
              {/* Search Button with Keyboard Shortcut Hint */}
              <Button
                isIconOnly
                variant="light"
                aria-label="Search (Ctrl+K)"
                onClick={() => openSearch(true)}
                className="relative text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800 group"
                title="Search articles (Ctrl+K)"
              >
                <Search className="w-5 h-5" />
                {/* Keyboard Shortcut Hint Box */}
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  <div className="bg-gray-900 dark:bg-gray-200 text-white dark:text-gray-900 text-xs px-2 py-1 rounded border border-gray-700 dark:border-gray-300 font-mono font-semibold">
                    Ctrl + K
                  </div>
                  {/* Tooltip arrow */}
                  <div className="absolute top-[-4px] left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-200 border-t border-l border-gray-700 dark:border-gray-300 rotate-45"></div>
                </div>
              </Button>

              {/* Theme Toggle */}
              <Button
                isIconOnly
                variant="light"
                aria-label="Toggle theme"
                onClick={toggleTheme}
                className="text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800"
              >
                {isDark ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
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
                  {!typesLoading && types.length > 0 ? (
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
                  ) : null}

                  {isSignedIn && systemMenuItems.length > 0 ? (
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

                  {!isSignedIn ? (
                    <DropdownSection title="Account">
                      <DropdownItem
                        key="login"
                        onPress={() => router.push("/auth/login")}
                      >
                        Login
                      </DropdownItem>
                      <DropdownItem
                        key="signup"
                        onPress={() => router.push("/auth/signup")}
                      >
                        Sign Up
                      </DropdownItem>
                    </DropdownSection>
                  ) : null}
                </DropdownMenu>
              </Dropdown>

              {/* Auth Buttons / User Button */}
              <AuthButtons />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
