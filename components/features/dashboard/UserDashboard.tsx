import { BookOpen, Heart, MessageCircle, Eye } from "lucide-react";
import Link from "next/link";

interface UserDashboardProps {
  userEmail: string | null;
}

export function UserDashboard({ userEmail }: UserDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back, {userEmail || "User"}!
        </p>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">My Posts</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">12</p>
            </div>
            <div className="p-3 bg-blue-500 rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-sm text-blue-600 mt-4">Published articles</p>
        </div>

        <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-6 border border-pink-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-pink-700">Total Likes</p>
              <p className="text-3xl font-bold text-pink-900 mt-2">342</p>
            </div>
            <div className="p-3 bg-pink-500 rounded-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-sm text-pink-600 mt-4">Across all posts</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Comments</p>
              <p className="text-3xl font-bold text-green-900 mt-2">89</p>
            </div>
            <div className="p-3 bg-green-500 rounded-lg">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-4">Engagement received</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Views</p>
              <p className="text-3xl font-bold text-purple-900 mt-2">2.4k</p>
            </div>
            <div className="p-3 bg-purple-500 rounded-lg">
              <Eye className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-sm text-purple-600 mt-4">Total impressions</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-blue-100 rounded">
              <BookOpen className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                New post published
              </p>
              <p className="text-xs text-gray-500 mt-1">
                &quot;Getting Started with Next.js 16&quot; - 2 hours ago
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-pink-100 rounded">
              <Heart className="h-4 w-4 text-pink-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                Your post received likes
              </p>
              <p className="text-xs text-gray-500 mt-1">
                15 new likes on &quot;Understanding React Hooks&quot; - 5 hours ago
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-green-100 rounded">
              <MessageCircle className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">New comment</p>
              <p className="text-xs text-gray-500 mt-1">
                Someone commented on &quot;TypeScript Best Practices&quot; - 1 day ago
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Quick Links
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/my-posts"
            className="p-3 bg-white rounded-lg hover:shadow-md transition-shadow border border-gray-200"
          >
            <p className="font-medium text-gray-900 text-sm">View My Posts</p>
          </Link>
          <Link
            href="/profile"
            className="p-3 bg-white rounded-lg hover:shadow-md transition-shadow border border-gray-200"
          >
            <p className="font-medium text-gray-900 text-sm">Edit Profile</p>
          </Link>
          <Link
            href="/settings"
            className="p-3 bg-white rounded-lg hover:shadow-md transition-shadow border border-gray-200"
          >
            <p className="font-medium text-gray-900 text-sm">Settings</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
