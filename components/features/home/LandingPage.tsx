"use client";

import { Button, Card, CardBody, Input } from "@heroui/react";
import { ArrowRight, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { textToSlug } from "@/lib/slug";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { iconMap } from "@/components/ui/customIcons";

interface TypeWithCount {
  id: string;
  name: string;
  description: string | null;
  postCount: number;
}

interface Category extends TypeWithCount {
  slug: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Fetch function for TanStack Query
const fetchTypes = async (): Promise<Category[]> => {
  const response = await fetch("/api/public/types");
  const result = await response.json();

  if (!result.success) {
    throw new Error("Failed to fetch types");
  }

  return result.data.map((type: TypeWithCount) => ({
    ...type,
    slug: textToSlug(type.name),
    icon:
      iconMap[textToSlug(type.name)] ||
      iconMap[type.name.toLowerCase()] ||
      iconMap["personal-blog"],
  }));
};

export function LandingPage() {
  // Use TanStack Query with caching
  const { data: categories = [], isLoading: loading } = useQuery({
    queryKey: ["publicTypes"],
    queryFn: fetchTypes,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
  });

  const totalArticles = categories.reduce(
    (sum: number, type: TypeWithCount) => sum + type.postCount,
    0
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b-2 border-dashed border-gray-300 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
          <div className="text-center">

            <Heading className="text-6xl sm:text-7xl lg:text-8xl font-bold mb-8 leading-none tracking-tight text-gray-900 dark:text-white overflow-hidden">
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  y: [0, -15, 0, -15, 0]
                }}
                transition={{
                  opacity: { duration: 0.8, ease: "easeOut" },
                  x: { duration: 0.8, ease: "easeOut" },
                  y: {
                    duration: 0.6,
                    delay: 4,
                    repeat: Infinity,
                    repeatDelay: 2
                  }
                }}
                className="inline-block"
              >
                Stories
              </motion.div>
              <motion.span
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="inline-block ml-2"
              >
                &
              </motion.span>
              <br />
              <motion.span
                initial={{ opacity: 0, x: 100 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  y: [0, -10, 5, -10, 5, 0]
                }}
                transition={{
                  opacity: { duration: 0.8, ease: "easeOut", delay: 0.2 },
                  x: { duration: 0.8, ease: "easeOut", delay: 0.2 },
                  y: {
                    duration: 0.6,
                    delay: 5,
                    repeat: Infinity,
                    repeatDelay: 2.0
                  }
                }}
                className="relative inline-block mb-5"
              >
                Knowledge
                <div className="absolute -bottom-5 left-0 w-full h-1 bg-gray-900 dark:bg-white"></div>
              </motion.span>
            </Heading>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            >
              <Text className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
                A curated collection of thoughts and insights
              </Text>
            </motion.div>

            {/* Stats with dashed separators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
              className="flex flex-wrap gap-8 justify-center items-center text-sm text-gray-600 dark:text-gray-400"
            >
              <motion.div
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {loading ? (
                    <Loader2 className="h-8 w-8 animate-spin inline" />
                  ) : (
                    `${totalArticles}${totalArticles > 0 ? "+" : ""}`
                  )}
                </div>
                <div className="text-xs uppercase tracking-wider">Articles</div>
              </motion.div>
              <div className="w-px h-12 border-l-2 border-dashed border-gray-300 dark:border-gray-700"></div>
              <motion.div
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {loading ? (
                    <Loader2 className="h-8 w-8 animate-spin inline" />
                  ) : (
                    categories.length
                  )}
                </div>
                <div className="text-xs uppercase tracking-wider">
                  Categories
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div>
          <div className="text-center mb-20">
            <Heading className="text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
              Choose Your Path
            </Heading>
            <Text className="text-lg text-gray-600 dark:text-gray-400 font-light">
              Browse through different categories
            </Text>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              {categories.map((category: Category, _index: number) => {
                const Icon = category.icon;
                const href = `/${category.slug}`;
                return (
                  <motion.div
                    key={category.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          duration: 0.5,
                          ease: "easeOut",
                        },
                      },
                    }}
                  >
                    <Link href={href}>
                      <motion.div
                        className="group relative h-full border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-10 hover:border-gray-900 dark:hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all duration-300 cursor-pointer"
                        whileHover={{ y: -5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                      {/* Decorative corner accents */}
                      <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-gray-900 dark:border-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-gray-900 dark:border-white opacity-0 group-hover:opacity-100 transition-opacity"></div>

                      <div className="flex flex-col h-full">
                        {/* Icon */}
                        <div className="mb-6">
                          <div
                            className={`inline-flex items-center justify-center w-16 h-16 border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-full group-hover:border-gray-900 dark:group-hover:border-white transition-all duration-300 ${
                              category.slug === "personal-blog" ||
                              category.slug === "personal"
                                ? "group-hover:scale-110"
                                : "group-hover:rotate-90"
                            }`}
                          >
                            <Icon
                              className={
                                category.slug === "personal-blog"
                                  ? "h-14 w-14"
                                  : "h-7 w-7 text-gray-900 dark:text-white"
                              }
                            />
                          </div>
                        </div>

                        {/* Content */}
                        <Heading className="text-3xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                          {category.name}
                        </Heading>

                        <Text className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed font-light grow">
                          {category.description ||
                            "Explore articles in this category"}
                        </Text>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-6 border-t-2 border-dashed border-gray-200 dark:border-gray-700">
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">
                            {category.postCount} Articles
                          </span>

                          <div className="flex items-center gap-2 text-gray-900 dark:text-white font-medium group-hover:gap-4 transition-all">
                            <span>Explore</span>
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                          </div>
                        </div>
                      </div>
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section - Join Community */}
      <section className="border-t-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 py-24 mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-lg p-8 sm:p-12 bg-white dark:bg-gray-950 text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <Heading className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white tracking-tight">
              Never Miss an Update
            </Heading>
            <Text className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-8 font-light">
              Create your account to get notifications for the latest articles and updates
            </Text>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  color="primary"
                  className="w-full sm:w-auto px-8 font-medium"
                >
                  Create Account
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button
                  size="lg"
                  variant="bordered"
                  className="w-full sm:w-auto px-8 font-medium"
                >
                  Sign In
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
