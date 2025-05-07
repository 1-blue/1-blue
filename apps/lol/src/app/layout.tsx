import "@1-blue/ui/globals.css";
import { ThemeToggle } from "@1-blue/ui/components/custom/ThemeToggle";
import { ThemeProvider } from "@1-blue/ui/providers";
import TanstackQueryProvider from "#src/providers/TanstackQueryProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "./_components/common/Footer";

export const generateMetadata = async (): Promise<Metadata> => {
  const title = "리그오브레전드 스킨 퀴즈";
  const description = "리그 오브 레전드 챔피언 스킨을 맞춰보세요!";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
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
      </head>
      <body className="flex flex-col min-h-screen bg-background text-foreground">
        <TanstackQueryProvider>
          <ThemeProvider>
            <ThemeToggle />

            <main className="flex-grow w-full">{children}</main>
            <Footer />
          </ThemeProvider>
        </TanstackQueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
