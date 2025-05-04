import "@1-blue/ui/globals.css";
import { ThemeToggle } from "@1-blue/ui/components/custom/ThemeToggle";
import { ThemeProvider } from "@1-blue/ui/providers";
import TanstackQueryProvider from "#src/providers/TanstackQueryProvider";

const RootLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <html lang="ko" suppressHydrationWarning>
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
