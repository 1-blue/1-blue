import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ROBOTS_NOINDEX } from "@/app/_config/site-seo";

export const metadata: Metadata = {
  robots: ROBOTS_NOINDEX,
};

const Layout = ({ children }: { children: ReactNode }) => children;

export default Layout;
