import { Metadata } from "next";
import Script from "next/script";
import { LandingPage } from "@/components/features/home/LandingPage";
import { generateWebsiteSchema } from "@/lib/schema";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "Joshtri Lenggu Blog - Language Learning & Technology",
  description:
    "Explore articles about language learning, technology, and personal development. A blog dedicated to helping you learn and grow.",
  keywords: "blog, language learning, technology, programming, education",
  authors: [{ name: "Joshtri Lenggu" }],
  openGraph: {
    title: "Joshtri Lenggu Blog",
    description: "A blog about language learning and technology",
    type: "website",
    url: BASE_URL,
    siteName: "Joshtri Lenggu Blog",
    images: [
      {
        url: `${BASE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Joshtri Lenggu Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Joshtri Lenggu Blog",
    description: "A blog about language learning and technology",
    images: [`${BASE_URL}/og-image.jpg`],
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default function HomeBlog() {
  const websiteSchema = generateWebsiteSchema();

  return (
    <>
      {/* JSON-LD Schema Markup */}
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
        strategy="afterInteractive"
      />
      <LandingPage />
    </>
  );
}
