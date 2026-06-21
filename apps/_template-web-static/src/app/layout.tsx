import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { createSiteMetadata } from "@1-blue/seo";
import { SITE_KEYWORDS } from "@/app/_config/site-seo";
import { AdSenseScript } from "@/app/_components/AdSenseScript";

const notoSans = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-sans",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:{{PORT}}";

export const metadata: Metadata = createSiteMetadata({
  title: "{{APP_NAME}}",
  description: "{{APP_DESCRIPTION}}",
  siteUrl,
  keywords: [...SITE_KEYWORDS],
});

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ko" className={`${notoSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <AdSenseScript />
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
