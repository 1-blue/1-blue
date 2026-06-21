"use client";

import * as React from "react";

type ThemeProviderProps = {
  children: React.ReactNode;
  attribute?: "class" | "data-theme";
  defaultTheme?: string;
  enableSystem?: boolean;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  return <>{children}</>;
};
