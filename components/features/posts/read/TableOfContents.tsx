"use client";

import { useEffect, useState } from "react";
import { Heading } from "@/components/ui/Heading";
import { Card, CardBody, CardHeader } from "@heroui/react";

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

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // Update URL without page reload
      window.history.pushState(null, "", `#${id}`);
    }
  };

  if (toc.length === 0) return null;

  return (
    <Card className="sticky top-32 w-52">
      <CardHeader className="pb-3">
        <Heading className="text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
          Table of Contents
        </Heading>
      </CardHeader>
      <CardBody className="pt-0 px-2">
        <nav>
          <ul className="space-y-2">
            {toc.map((item) => (
              <li
                key={item.id}
                className="list-disc ml-3"
                style={{ 
                  marginLeft: `${item.level * 0.8}rem`,
                }}
              >
                <a
                  href={`#${item.id}`}
                  onClick={(e) => handleClick(e, item.id)}
                  className={`text-xs transition-colors cursor-pointer line-clamp-2 leading-relaxed ${
                    activeId === item.id
                      ? "text-blue-600 dark:text-blue-400 font-medium"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  }`}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </CardBody>
    </Card>
  );
}
