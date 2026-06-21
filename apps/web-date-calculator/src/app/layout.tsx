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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:7001";

export const metadata: Metadata = {
  ...createSiteMetadata({
    title: "날짜 계산기 | 두 날짜 사이 며칠 · 100일 후 날짜 계산",
    description:
      "시작일과 종료일 사이 며칠인지, 100일 후·30일 전 날짜를 바로 계산하는 무료 날짜 계산기. 시작일 포함 옵션 지원.",
    siteUrl,
    keywords: [...SITE_KEYWORDS],
  }),
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ko" className={`${notoSans.variable} ${GeistMono.variable}`}>
      <head>
        {/* 네이버 서치 어드바이저 */}
        <meta name="naver-site-verification" content="1ebf961fc4256cb9377909b8b2c0b6ff03483dde" />

        {/* 구글 서치 콘솔 */}
        <meta
          name="google-site-verification"
          content="p2Ms1Y47Y1AAQkm2jbrRv3JQW7JklbdW5ua9MGjI7SU"
        />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <AdSenseScript />
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
