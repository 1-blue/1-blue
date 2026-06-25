import type { MetadataRoute } from "next";
import { getAppSiteUrl } from "@/app/_config/site-url";

export const dynamic = "force-static";

const robots = (): MetadataRoute.Robots => {
  const siteUrl = getAppSiteUrl().replace(/\/$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/manage/",
        "/api/",
        "/cbt/*/take",
        "/cbt/*/result/",
        "/create/complete",
        "/create/questions",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
};

export default robots;
