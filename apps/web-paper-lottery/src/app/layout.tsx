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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:7002";

export const metadata: Metadata = {
  ...createSiteMetadata({
    title: "온라인 종이뽑기 | 링크·QR로 바로 시작하는 뽑기판",
    description:
      "회원가입 없이 온라인 종이뽑기판을 만들고, 참가자별 비밀 링크·QR로 다회 뽑기를 진행하세요. 등수 잔여 표시와 자동 결과 공개를 지원합니다.",
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
        <meta name="naver-site-verification" content="4a7d13859758b22b9118cdc25c0fead27f68d2d3" />

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
