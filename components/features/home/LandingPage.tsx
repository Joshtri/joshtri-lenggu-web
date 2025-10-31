"use client";

import { Card, CardBody } from "@heroui/react";
import { BookHeart, Code2, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

const categories = [
  {
    title: "Personal Blog",
    description: "My personal thoughts, life experiences, and reflections on various topics",
    icon: BookHeart,
    href: "/blog-personal",
    stats: "12 Articles",
  },
  {
    title: "Technology",
    description: "Deep dives into tech trends, tutorials, and insights on modern development",
    icon: Code2,
    href: "/blog-teknologi",
    stats: "18 Articles",
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b-2 border-dashed border-gray-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
          <div className="text-center">
            {/* Decorative dashed box */}
            <div className="inline-block mb-8">
              {/* <div className="border-2 border-dashed border-gray-400 rounded-lg px-6 py-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <Sparkles className="h-4 w-4" />
                   <span className="text-sm font-medium tracking-wide">WELCOME</span>
                </div>
              </div> */}
            </div>

            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold mb-8 leading-none tracking-tight text-gray-900">
              Stories &<br />
              <span className="relative inline-block">
                Knowledge
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gray-900"></div>
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
              A curated collection of thoughts and insights
            </p>

            {/* Stats with dashed separators */}
            <div className="flex flex-wrap gap-8 justify-center items-center text-sm text-gray-600">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">30+</div>
                <div className="text-xs uppercase tracking-wider">Articles</div>
              </div>
              <div className="w-px h-12 border-l-2 border-dashed border-gray-300"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">2</div>
                <div className="text-xs uppercase tracking-wider">Categories</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div>
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Choose Your Path
            </h2>
            <p className="text-lg text-gray-600 font-light">
              Browse through different categories
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link key={category.href} href={category.href}>
                  <div className="group relative h-full border-2 border-dashed border-gray-300 rounded-lg p-10 hover:border-gray-900 hover:bg-gray-50 transition-all duration-300 cursor-pointer">
                    {/* Decorative corner accents */}
                    <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-gray-900 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-gray-900 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    <div className="flex flex-col h-full">
                      {/* Icon */}
                      <div className="mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 border-2 border-dashed border-gray-400 rounded-full group-hover:border-gray-900 group-hover:rotate-90 transition-all duration-300">
                          <Icon className="h-7 w-7 text-gray-900" />
                        </div>
                      </div>

                      {/* Content */}
                      <h3 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">
                        {category.title}
                      </h3>

                      <p className="text-gray-600 mb-8 leading-relaxed font-light flex-grow">
                        {category.description}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-6 border-t-2 border-dashed border-gray-200">
                        <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                          {category.stats}
                        </span>

                        <div className="flex items-center gap-2 text-gray-900 font-medium group-hover:gap-4 transition-all">
                          <span>Explore</span>
                          <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t-2 border-dashed border-gray-300 bg-gray-50 py-24 mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-2 border-dashed border-gray-400 rounded-lg p-12 bg-white text-center">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 tracking-tight">
              Stay Updated
            </h2>
            <p className="text-lg text-gray-600 mb-10 font-light">
              Get the latest articles delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="px-6 py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 flex-1 font-light"
              />
              <button className="px-8 py-4 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors border-2 border-gray-900">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
