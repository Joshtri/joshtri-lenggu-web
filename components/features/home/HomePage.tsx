"use client";

import { useState } from "react";
import { Post } from "@/components/features/posts/interfaces/posts";
import { Label } from "@/components/features/labels/interfaces/labels";
import { BlogCard } from "./BlogCard";

interface HomePageProps {
  posts: Post[];
  labels: Label[];
}

export function HomePage({ posts, labels }: HomePageProps) {
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  // Filter posts based on selected label
  const filteredPosts = selectedLabel
    ? posts.filter((post) => post.labelId === selectedLabel)
    : posts;

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Tabs */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedLabel(null)}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all border-2 border-dashed uppercase tracking-wider text-sm ${
                selectedLabel === null
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-900"
              }`}
            >
              All Posts
              <span className="ml-2 opacity-70">
                ({posts.length})
              </span>
            </button>

            {labels.map((label) => {
              const postCount = posts.filter(
                (post) => post.labelId === label.id
              ).length;

              return (
                <button
                  key={label.id}
                  onClick={() => setSelectedLabel(label.id)}
                  className={`px-5 py-2.5 rounded-lg font-medium transition-all border-2 border-dashed uppercase tracking-wider text-sm ${
                    selectedLabel === label.id
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-700 border-gray-300 hover:border-gray-900"
                  }`}
                >
                  {label.name}
                  <span className="ml-2 opacity-70">
                    ({postCount})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Blog Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => {
              const label = labels.find((l) => l.id === post.labelId);
              return <BlogCard key={post.id} post={post} label={label} />;
            })}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500 text-lg font-light">
              No posts found in this category yet.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
