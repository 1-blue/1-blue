import type { MetadataRoute } from "next";
import { ROUTES } from "@/app/_constants/routes";
import { getAppSiteUrl } from "@/app/_config/site-url";

export const dynamic = "force-static";

const robots = (): MetadataRoute.Robots => {
  const siteUrl = getAppSiteUrl().replace(/\/$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", ROUTES.RANDOM.path],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
};

export default robots;
