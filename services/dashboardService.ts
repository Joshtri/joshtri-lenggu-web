import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Types for dashboard statistics
export interface DashboardStats {
  posts: {
    total: number;
    change: number;
    trend: "up" | "down";
    currentMonth: number;
    lastMonth: number;
  };
  users: {
    total: number;
    change: number;
    trend: "up" | "down";
    currentMonth: number;
    lastMonth: number;
  };
  labels: {
    total: number;
  };
  comments: {
    total: number;
  };
  uptime: {
    percentage: number;
  };
}

interface DashboardStatsResponse {
  success: boolean;
  data: DashboardStats;
  error?: string;
}

/**
 * Fetch dashboard statistics from API
 */
async function fetchDashboardStats(): Promise<DashboardStats> {
  const response = await axios.get<DashboardStatsResponse>("/api/dashboard/stats");
  
  if (!response.data.success) {
    throw new Error(response.data.error || "Failed to fetch dashboard stats");
  }
  
  return response.data.data;
}

/**
 * React Query hook to fetch dashboard statistics
 * 
 * @example
 * ```tsx
 * const { data: stats, isLoading, error } = useDashboardStats();
 * 
 * if (isLoading) return <LoadingSpinner />;
 * if (error) return <ErrorMessage error={error} />;
 * 
 * return <div>Total Posts: {stats.posts.total}</div>
 * ```
 */
export function useDashboardStats() {
  return useQuery<DashboardStats, Error>({
    queryKey: ["dashboard", "stats"],
    queryFn: fetchDashboardStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
    refetchOnWindowFocus: true,
  });
}
