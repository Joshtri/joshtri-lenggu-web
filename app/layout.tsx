import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
//@ts-expect-error import global css;
import "./globals.css";
import Providers from "@/providers";
import { LoadingBar } from "@/components/ui/LoadingBar";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { ClerkProviderWrapper } from "@/lib/ClerkProviderWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Joshtri Lenggu Blog",
  description: "A blog about language learning and technology",
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=5.0",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Joshtri Lenggu Blog",
  },
  icons: {
    icon: "/favicon.ico",
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#2563eb",
      },
    ],
  },
  applicationName: "Joshtri Lenggu Blog",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#121212" },
  ],
  // msapplication: {
  //   TileColor: "#2563eb",
  //   TileImage: "/mstile-144x144.png",
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProviderWrapper>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                try {
                  const theme = localStorage.getItem('theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (theme === 'dark' || (!theme && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              `,
            }}
          />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <LoadingBar />
          <ScrollToTop />
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProviderWrapper>
  );
}
