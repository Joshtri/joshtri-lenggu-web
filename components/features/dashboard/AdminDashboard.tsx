import { BarChart3, Users, FileText, Tags, TrendingUp } from "lucide-react";
import Link from "next/link";

interface AdminDashboardProps {
  userEmail: string | null;
}

export function AdminDashboard({ userEmail }: AdminDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard - development</h1>
        <p className="text-gray-600 mt-1">
          Welcome back, {userEmail || "Admin"}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Posts</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">128</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            +12% from last month
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">1,245</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            +5% from last month
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Labels</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">24</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Tags className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">Across all posts</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Analytics</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">98.5%</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">Uptime percentage</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/sys/posts/create"
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FileText className="h-5 w-5 text-blue-600 mb-2" />
            <p className="font-medium text-gray-900">Create New Post</p>
            <p className="text-sm text-gray-500 mt-1">
              Start writing a new blog post
            </p>
          </Link>
          <a
            href="/sys/labels"
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Tags className="h-5 w-5 text-purple-600 mb-2" />
            <p className="font-medium text-gray-900">Manage Labels</p>
            <p className="text-sm text-gray-500 mt-1">
              Organize post categories
            </p>
          </a>
          <Link
            href="/sys/posts"
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <BarChart3 className="h-5 w-5 text-orange-600 mb-2" />
            <p className="font-medium text-gray-900">View All Posts</p>
            <p className="text-sm text-gray-500 mt-1">
              Manage existing content
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
