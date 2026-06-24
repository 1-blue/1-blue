import type { Metadata } from "next";
import { Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { createSiteMetadata } from "@1-blue/seo";
import { SITE_KEYWORDS } from "@/app/_config/site-seo";
import { AdSenseScript } from "@/app/_components/AdSenseScript";
import { QueryProvider } from "@/app/_components/QueryProvider";
import { AppToaster } from "@/app/_components/AppToaster";

const notoSans = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-sans",
});

const notoSerif = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-serif",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:7004";

export const metadata: Metadata = {
  ...createSiteMetadata({
    title: "오늘의 추론 — 매일 새로운 추리 퍼즐",
    description:
      "단서를 읽고 거짓을 가려내세요. 암기 모드와 열람 모드로 오늘의 추론 퍼즐을 풀고 랭킹에 도전하세요.",
    siteUrl,
    keywords: [...SITE_KEYWORDS],
  }),
  manifest: "/site.webmanifest",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ko" className={`${notoSans.variable} ${notoSerif.variable} ${GeistMono.variable}`}>
      <head>
        {/* 네이버 서치 어드바이저 */}
        <meta name="naver-site-verification" content="cc0fa4267a143f8e121ab31ff749f1ebe612da9f" />

        {/* 구글 서치 콘솔 */}
        <meta
          name="google-site-verification"
          content="p2Ms1Y47Y1AAQkm2jbrRv3JQW7JklbdW5ua9MGjI7SU"
        />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <AdSenseScript />
        <QueryProvider>{children}</QueryProvider>
        <AppToaster />
      </body>
    </html>
  );
};

export default RootLayout;
