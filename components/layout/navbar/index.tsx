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
import { Search, Sun, Moon, Menu, FileEdit } from "lucide-react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { publicMenuItems, systemMenuItems } from "@/config/navigationItem";

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const router = useRouter();
  const { isSignedIn } = useUser();

  // Check theme on mount
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setTimeout(() => {
      setIsDark(isDarkMode);
    }, 100);
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
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo & Navigation */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <NextLink
              href="/"
              className="flex items-center gap-2 text-xl font-bold text-foreground hover:text-primary transition-colors"
            >
              <FileEdit className="w-6 h-6" />
              <span className="hidden sm:inline">Blog</span>
            </NextLink>

            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex items-center gap-6">
              {publicMenuItems.map((item) => (
                <NextLink
                  key={item.key}
                  href={item.href}
                  className="text-sm text-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  {item.icon}
                  {item.label}
                </NextLink>
              ))}
            </div>
          </div>

          {/* Right: Search, Theme Toggle, User */}
          <div className="flex items-center gap-3">
            {/* Search Button */}
            <Button
              isIconOnly
              variant="light"
              aria-label="Search"
              className="hover:bg-default-100"
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* Theme Toggle */}
            {/* <Button
              isIconOnly
              variant="light"
              aria-label="Toggle theme"
              onPress={toggleTheme}
              className="hover:bg-default-100"
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button> */}

            {/* Mobile Menu - Dropdown */}
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button
                  isIconOnly
                  variant="light"
                  className="md:hidden"
                  aria-label="Menu"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Mobile menu">
                <DropdownSection title="Public">
                  {publicMenuItems.map((item) => (
                    <DropdownItem
                      key={item.key}
                      startContent={item.icon}
                      onPress={() => router.push(item.href)}
                    >
                      {item.label}
                    </DropdownItem>
                  ))}
                </DropdownSection>

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
