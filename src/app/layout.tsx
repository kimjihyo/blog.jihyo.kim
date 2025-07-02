import type { Metadata, Viewport } from "next";
import { siteConfig } from "@/config/site";
import { SiteHeader } from "@/components/layouts/site-header";
import { SiteFooter } from "@/components/layouts/site-footer";
import { ThemeProvider } from "@/components/providers/theme-provider";

import { Analytics } from "@vercel/analytics/next";

import localFont from "next/font/local";

const pretendard = localFont({
  src: [
    {
      path: "../assets/fonts/PretendardVariable.woff2",
    },
  ],
});

import "@/styles/globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["nextjs", "react", "kimjihyo", "kimjihyo0325"],
  authors: [
    {
      name: "Jihyo Kim",
      url: "https://blog.jihyo.kim",
    },
  ],
  creator: "Jihyo Kim",
  openGraph: {
    type: "website",
    locale: "ko",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: siteConfig.url,
  },
  verification: {
    google: "wVEPS5qlRFBKhKAzxd8vSVKupU92v7STVgJzvm15tNo",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.url,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning className={pretendard.className}>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </ThemeProvider>
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
