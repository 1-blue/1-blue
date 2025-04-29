import "@1-blue/ui/globals.css";
import { ThemeToggle } from "@1-blue/ui/components/custom/ThemeToggle";
import { ThemeProvider } from "@1-blue/ui/providers";

const RootLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <ThemeToggle />

          {children}
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
