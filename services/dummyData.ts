import { Post } from "@/components/features/posts/interfaces/posts";
import { Label } from "@/components/features/labels/interfaces/labels";

// Dummy Labels
export const dummyLabels: Label[] = [
  {
    id: 1,
    name: "Personal",
    color: "#3B82F6", // Blue
    description: "Personal thoughts and experiences",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: 2,
    name: "Technology",
    color: "#10B981", // Green
    description: "Tech tutorials and insights",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: 3,
    name: "Web Development",
    color: "#8B5CF6", // Purple
    description: "Web development tips and tricks",
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02"),
  },
];

// Dummy Posts
export const dummyPosts: Post[] = [
  {
    id: 1,
    slug: "my-journey-learning-nextjs",
    title: "My Journey Learning Next.js 15",
    coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
    content: "Full content here...",
    excerpt: "Sharing my experience learning Next.js 15 and the App Router. It's been an incredible journey filled with challenges and breakthroughs.",
    authorId: 1,
    labelId: 1, // Personal
    createdAt: new Date("2024-10-15"),
    updatedAt: new Date("2024-10-15"),
  },
  {
    id: 2,
    slug: "understanding-react-server-components",
    title: "Understanding React Server Components",
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
    content: "Full content here...",
    excerpt: "A deep dive into React Server Components and how they revolutionize the way we build React applications.",
    authorId: 1,
    labelId: 2, // Technology
    createdAt: new Date("2024-10-20"),
    updatedAt: new Date("2024-10-20"),
  },
  {
    id: 3,
    slug: "tailwind-css-best-practices",
    title: "Tailwind CSS Best Practices for 2024",
    coverImage: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&h=400&fit=crop",
    content: "Full content here...",
    excerpt: "Learn the best practices for using Tailwind CSS in modern web applications, including tips for optimization and maintainability.",
    authorId: 1,
    labelId: 3, // Web Development
    createdAt: new Date("2024-10-22"),
    updatedAt: new Date("2024-10-22"),
  },
  {
    id: 4,
    slug: "reflections-on-coding-career",
    title: "Reflections on My Coding Career",
    coverImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop",
    content: "Full content here...",
    excerpt: "Looking back at my journey as a developer - the ups, downs, and everything in between.",
    authorId: 1,
    labelId: 1, // Personal
    createdAt: new Date("2024-10-25"),
    updatedAt: new Date("2024-10-25"),
  },
  {
    id: 5,
    slug: "typescript-advanced-patterns",
    title: "Advanced TypeScript Patterns You Should Know",
    coverImage: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop",
    content: "Full content here...",
    excerpt: "Explore advanced TypeScript patterns that will take your type safety and developer experience to the next level.",
    authorId: 1,
    labelId: 2, // Technology
    createdAt: new Date("2024-10-28"),
    updatedAt: new Date("2024-10-28"),
  },
  {
    id: 6,
    slug: "building-fullstack-app-with-nextjs",
    title: "Building a Full-Stack App with Next.js and Drizzle",
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
    content: "Full content here...",
    excerpt: "A comprehensive guide to building a full-stack application using Next.js 15, Drizzle ORM, and PostgreSQL.",
    authorId: 1,
    labelId: 3, // Web Development
    createdAt: new Date("2024-10-30"),
    updatedAt: new Date("2024-10-30"),
  },
];

/**
 * Get all posts (sorted by newest first)
 */
export function getAllPosts(): Post[] {
  return [...dummyPosts].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Get posts by label ID
 */
export function getPostsByLabel(labelId: number): Post[] {
  return dummyPosts
    .filter(post => post.labelId === labelId)
    .sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

/**
 * Get post by slug
 */
export function getPostBySlug(slug: string): Post | undefined {
  return dummyPosts.find(post => post.slug === slug);
}

/**
 * Get label by ID
 */
export function getLabelById(id: number): Label | undefined {
  return dummyLabels.find(label => label.id === id);
}

/**
 * Get all labels
 */
export function getAllLabels(): Label[] {
  return dummyLabels;
}
