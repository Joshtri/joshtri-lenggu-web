"use client";

import { HeroUIProvider, ToastProvider } from "@heroui/react";
import React from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { SearchProvider } from "./SearchProvider";
import { NotificationProvider } from "./NotificationProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes default
      gcTime: 1000 * 60 * 10, // 10 minutes (garbage collection)
      refetchOnWindowFocus: false, // Disable refetch on window focus
      retry: 1, // Retry failed requests once
    },
  },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <ToastProvider />
      <QueryClientProvider client={queryClient}>
        <NotificationProvider>
          <SearchProvider>
            {children}
          </SearchProvider>
        </NotificationProvider>
      </QueryClientProvider>
    </HeroUIProvider>
  );
}
