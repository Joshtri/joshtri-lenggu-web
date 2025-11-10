"use client";

import {
  BarChart3,
  Users,
  FileText,
  Tags,
  TrendingUp,
  TrendingDown,
  MessageSquare,
} from "lucide-react";
import { Card, CardBody } from "@heroui/react";
import { Skeleton } from "@heroui/react";
import { Link } from "@heroui/react";
import { useDashboardStats } from "@/services/dashboardService";

interface AdminDashboardProps {
  userEmail: string | null;
}

export function AdminDashboard({ userEmail }: AdminDashboardProps) {
  const { data: stats, isLoading, error } = useDashboardStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-default-500 mt-1">
          Welcome back, {userEmail || "Admin"}
        </p>
      </div>

      {/* Stats Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} shadow="sm">
              <CardBody>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-8 w-1/2" />
              </CardBody>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card shadow="sm">
          <CardBody>
            <p className="text-danger font-medium">
              Failed to load dashboard statistics
            </p>
            <p className="text-danger text-sm mt-1">{error.message}</p>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Posts */}
          <Card shadow="sm" isHoverable>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-default-500">Total Posts</p>
                  <p className="text-2xl font-bold mt-2">
                    {stats?.posts.total.toLocaleString() || 0}
                  </p>
                </div>
                <FileText className="h-6 w-6" />
              </div>
              {stats?.posts.change !== 0 && (
                <p
                  className={`text-sm mt-4 flex items-center ${
                    stats?.posts.trend === "up" ? "text-success" : "text-danger"
                  }`}
                >
                  {stats?.posts.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {Math.abs(stats?.posts.change || 0)}% from last month
                </p>
              )}
            </CardBody>
          </Card>

          {/* Total Users */}
          <Card shadow="sm" isHoverable>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-default-500">Total Users</p>
                  <p className="text-2xl font-bold mt-2">
                    {stats?.users.total.toLocaleString() || 0}
                  </p>
                </div>
                <Users className="h-6 w-6" />
              </div>
              {stats?.users.change !== 0 && (
                <p
                  className={`text-sm mt-4 flex items-center ${
                    stats?.users.trend === "up" ? "text-success" : "text-danger"
                  }`}
                >
                  {stats?.users.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {Math.abs(stats?.users.change || 0)}% from last month
                </p>
              )}
            </CardBody>
          </Card>

          {/* Total Labels */}
          <Card shadow="sm" isHoverable>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-default-500">Total Labels</p>
                  <p className="text-2xl font-bold mt-2">
                    {stats?.labels.total || 0}
                  </p>
                </div>
                <Tags className="h-6 w-6" />
              </div>
              <p className="text-sm text-default-400 mt-4">Across all posts</p>
            </CardBody>
          </Card>

          {/* Total Comments */}
          <Card shadow="sm" isHoverable>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-default-500">Total Comments</p>
                  <p className="text-2xl font-bold mt-2">
                    {stats?.comments.total.toLocaleString() || 0}
                  </p>
                </div>
                <MessageSquare className="h-6 w-6" />
              </div>
              <p className="text-sm text-default-400 mt-4">User engagement</p>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <Card shadow="sm">
        <CardBody>
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/posts/create"
              className="p-4 border rounded-lg hover:bg-default-100 transition-colors flex flex-col items-start"
            >
              <FileText className="h-5 w-5 mb-2" />
              <p className="font-medium">Create New Post</p>
              <p className="text-sm text-default-500 mt-1">
                Start writing a new blog post
              </p>
            </Link>
            <Link
              href="/labels"
              className="p-4 border rounded-lg hover:bg-default-100 transition-colors flex flex-col items-start"
            >
              <Tags className="h-5 w-5 mb-2" />
              <p className="font-medium">Manage Labels</p>
              <p className="text-sm text-default-500 mt-1">
                Organize post categories
              </p>
            </Link>
            <Link
              href="/posts"
              className="p-4 border rounded-lg hover:bg-default-100 transition-colors flex flex-col items-start"
            >
              <BarChart3 className="h-5 w-5 mb-2" />
              <p className="font-medium">View All Posts</p>
              <p className="text-sm text-default-500 mt-1">
                Manage existing content
              </p>
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
