"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { NotificationAdmin } from "./NotificationAdmin";
import { NotificationVisitor } from "./NotificationVisitor";
import { Bell } from "lucide-react";
import { Button } from "@heroui/react";

/**
 * NotificationGrid Component
 * Responsive wrapper component that checks user role and renders appropriate notification component
 * - Admin users: Shows NotificationAdmin with full notification system
 * - Non-admin users: Shows NotificationVisitor (read-only message)
 *
 * Role is fetched from the database (users table), not from Clerk publicMetadata
 */
export function NotificationGrid() {
  const { user, isLoaded } = useUser();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoadingRole, setIsLoadingRole] = useState(true);

  // Fetch user role from database using clerkId
  useEffect(() => {
    if (!isLoaded || !user?.id) {
      setIsLoadingRole(true);
      return;
    }

    const fetchUserRole = async () => {
      try {
        const response = await fetch(`/api/users/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setUserRole(data.data?.role || "VISITOR");
        } else {
          setUserRole("VISITOR");
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        setUserRole("VISITOR");
      } finally {
        setIsLoadingRole(false);
      }
    };

    fetchUserRole();
  }, [user?.id, isLoaded]);

  // Show loading state while user or role data is being fetched
  if (!isLoaded || isLoadingRole) {
    return (
      <Button isIconOnly variant="light" disabled aria-label="Loading...">
        <Bell className="w-5 h-5 text-gray-400" />
      </Button>
    );
  }

  // Check if user has ADMIN role (from database)
  const isAdmin = userRole === "ADMIN";

  return (
    <Suspense
      fallback={
        <Button isIconOnly variant="light" disabled aria-label="Loading...">
          <Bell className="w-5 h-5 text-gray-400" />
        </Button>
      }
    >
      {isAdmin ? <NotificationAdmin /> : <NotificationVisitor />}
    </Suspense>
  );
}
