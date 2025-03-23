import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/config/site";

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
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen font-pretendard antialiased">
        {children}
      </body>
    </html>
  );
}
