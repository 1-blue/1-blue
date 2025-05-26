import "@1-blue/ui/globals.css";
import { ThemeToggle } from "@1-blue/ui/components/custom/ThemeToggle";
import { ThemeProvider } from "@1-blue/ui/providers";

import TanstackQueryProvider from "#src/providers/TanstackQueryProvider";
import { Toaster } from "@1-blue/ui/components/sonner";

const RootLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <TanstackQueryProvider>
          <ThemeProvider>
            <ThemeToggle />
            <Toaster position="top-center" richColors theme="system" />

            {children}
          </ThemeProvider>
        </TanstackQueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
