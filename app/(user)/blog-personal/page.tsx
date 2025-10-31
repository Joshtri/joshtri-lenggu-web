import { HomePage } from "@/components/features/home/HomePage";
import { getPostsByLabel, getAllLabels, getLabelById } from "@/services/dummyData";

export default function BlogPersonalPage() {
  // Get posts with "Personal" label (labelId = 1)
  const posts = getPostsByLabel(1);
  const labels = getAllLabels();
  const currentLabel = getLabelById(1);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="border-b-2 border-dashed border-gray-300 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <a
              href="/"
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium flex items-center gap-2 border-2 border-dashed border-gray-300 rounded-lg px-4 py-2 hover:border-gray-900"
            >
              ← Back to Home
            </a>
          </div>
          <h1 className="text-6xl font-bold mb-6 text-gray-900 tracking-tight">
            Personal Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl font-light">
            {currentLabel?.description || "My personal thoughts and life experiences"}
          </p>
        </div>
      </section>

      {/* Blog List */}
      {posts.length > 0 ? (
        <HomePage posts={posts} labels={labels} />
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500 text-lg font-light">
              No personal blog posts yet. Check back soon!
            </p>
          </div>
        </main>
      )}
    </div>
  );
}
