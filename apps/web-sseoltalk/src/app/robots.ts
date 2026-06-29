import type { MetadataRoute } from "next";
import { getAppSiteUrl } from "@/app/_config/site-url";

export const dynamic = "force-static";

const robots = (): MetadataRoute.Robots => {
  const siteUrl = getAppSiteUrl().replace(/\/$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/random"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
};

export default robots;
