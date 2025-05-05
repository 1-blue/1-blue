import "@1-blue/ui/globals.css";
import { ThemeToggle } from "@1-blue/ui/components/custom/ThemeToggle";
import { ThemeProvider } from "@1-blue/ui/providers";
import TanstackQueryProvider from "#src/providers/TanstackQueryProvider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "리그 오브 레전드 스킨 퀴즈",
  description: "리그 오브 레전드 챔피언 스킨을 맞추는 퀴즈 게임입니다",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "LoL 스킨 퀴즈",
  },
  applicationName: "LoL 스킨 퀴즈",
  themeColor: "#1e293b",
  viewport: `minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover`,
};

const RootLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#1e293b" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body>
        <TanstackQueryProvider>
          <ThemeProvider>
            <ThemeToggle />

            {children}
          </ThemeProvider>
        </TanstackQueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
