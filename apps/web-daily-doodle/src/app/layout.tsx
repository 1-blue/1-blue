import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { createSiteMetadata } from "@1-blue/seo";
import { SITE_KEYWORDS } from "@/app/_config/site-seo";
import { AdSenseScript } from "@/app/_components/AdSenseScript";
import { QueryProvider } from "@/app/_components/QueryProvider";

const notoSans = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-sans",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:7003";

export const metadata: Metadata = {
  ...createSiteMetadata({
    title: "오늘의 낙서 — 매일 함께 그리는 공유 캔버스",
    description:
      "회원가입 없이 닉네임만으로 함께 그리는 일일 공유 낙서장. 자정이 되면 오늘의 낙서는 아카이브로 저장됩니다.",
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
    <html lang="ko" className={`${notoSans.variable} ${GeistMono.variable}`}>
      <head>
        {/* 네이버 서치 어드바이저 */}
        <meta name="naver-site-verification" content="0458c833bb825865873480b80bbf0befa9c28587" />

        {/* 구글 서치 콘솔 */}
        <meta
          name="google-site-verification"
          content="p2Ms1Y47Y1AAQkm2jbrRv3JQW7JklbdW5ua9MGjI7SU"
        />
      </head>

      <body className="min-h-screen font-sans antialiased">
        <AdSenseScript />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
