import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { createSiteMetadata } from "@1-blue/seo";
import { SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME, SITE_TITLE } from "@/app/_config/site-seo";
import { AdSenseScript } from "@/app/_components/AdSenseScript";
import { QueryProvider } from "@/app/_components/QueryProvider";

const notoSans = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-sans",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:7000";

const baseMetadata = createSiteMetadata({
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  siteUrl,
  keywords: [...SITE_KEYWORDS],
});

export const metadata: Metadata = {
  ...baseMetadata,
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  openGraph: {
    ...baseMetadata.openGraph,
    locale: "ko_KR",
    siteName: SITE_NAME,
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ko" className={`${notoSans.variable} ${GeistMono.variable}`}>
      <head>
        {/* 네이버 서치 어드바이저 */}
        <meta name="naver-site-verification" content="af8832b20c7450ff4cb25575d5f59a4835277e7a" />

        {/* 구글 서치 콘솔 */}
        <meta
          name="google-site-verification"
          content="p2Ms1Y47Y1AAQkm2jbrRv3JQW7JklbdW5ua9MGjI7SU"
        />
      </head>

      <body className="bg-page-bg text-text-primary min-h-dvh font-sans antialiased">
        <AdSenseScript />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
