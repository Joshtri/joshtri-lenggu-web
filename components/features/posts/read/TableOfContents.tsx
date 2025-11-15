"use client";

import { useEffect, useState } from "react";
import { Heading } from "@/components/ui/Heading";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Extract headings from article
    const article = document.querySelector("article");
    if (!article) return;

    const headings = article.querySelectorAll("h1, h2, h3, h4");
    const items: TocItem[] = [];

    headings.forEach((heading, index) => {
      const id = heading.id || `heading-${index}`;
      if (!heading.id) {
        heading.id = id;
      }

      items.push({
        id,
        text: heading.textContent || "",
        level: parseInt(heading.tagName.charAt(1)),
      });
    });

    // Defer state update to avoid cascading renders during effect
    const timeoutId = window.setTimeout(() => {
      setToc(items);
    }, 0);

    // Track active heading on scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId((entry.target as HTMLElement).id);
          }
        });
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    headings.forEach((heading) => observer.observe(heading));

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  if (toc.length === 0) return null;

  return (
    <div className="sticky top-32 space-y-4">
      <Heading className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
        Table of Contents
      </Heading>
      <nav className="space-y-2">
        {toc.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`block text-sm transition-colors ${
              item.level === 1 ? "pl-0" : `pl-${(item.level - 1) * 4}`
            } ${
              activeId === item.id
                ? "text-blue-600 dark:text-blue-400 font-medium"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
            style={{ paddingLeft: `${(item.level - 1) * 0.75}rem` }}
          >
            {item.text}
          </a>
        ))}
      </nav>
    </div>
  );
}
