import "@1-blue/ui/globals.css";
import { ThemeToggle } from "@1-blue/ui/components/custom/ThemeToggle";
import { ThemeProvider } from "@1-blue/ui/providers";
import TanstackQueryProvider from "#src/providers/TanstackQueryProvider";
import type { Metadata } from "next";
import Footer from "./_components/common/Footer";
import { Toaster } from "@1-blue/ui/components/sonner";

export const generateMetadata = async (): Promise<Metadata> => {
  // 기본 메타데이터 값
  const title = "리그오브레전드(lol) 스킨 퀴즈";
  const description = `리그오브레전드(lol) 챔피언 스킨, 아이템, 스킬을 맞춰보세요!\n리그 오브 레전드 챔피언 스킨 지식을 테스트해보세요! 객관식과 주관식 모드를 제공합니다.`;
  const imageUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Bard_35.jpg`;

  return {
    title,
    description,
    keywords: [
      "퀴즈",
      "리그오브레전드",
      "스킨",
      "챔피언",
      "스킬",
      "아이템",
      "퀴즈",
      "맞히기",
      "맞추기",
      "리그오브레전드 스킨 퀴즈",
      "리그오브레전드 스킨 맞추기",
    ],
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "리그오브레전드 스킨 퀴즈 대표 이미지",
        },
      ],
      type: "website",
      siteName: "리그오브레전드 스킨 퀴즈",
    },
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title,
    },
    applicationName: title,
    viewport: `minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover`,
  };
};

const RootLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />

        {/* 네이버 웹마스터 등록 */}
        <meta
          name="naver-site-verification"
          content="066fc78dc4389cd2ae177c7460988a38886a392d"
        />
      </head>
      <body className="flex flex-col min-h-screen bg-background text-foreground">
        <TanstackQueryProvider>
          <ThemeProvider>
            <ThemeToggle />
            <Toaster position="top-center" richColors theme="system" />
            <main className="flex-grow w-full">{children}</main>
            <Footer />
          </ThemeProvider>
        </TanstackQueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
