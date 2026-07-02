import type { MetadataRoute } from "next";
import { createSitemapEntriesFromRoutes } from "@1-blue/seo";
import { ROUTES } from "@/app/_constants/routes";
import { getAppSiteUrl } from "@/app/_config/site-url";

export const dynamic = "force-static";

const sitemap = (): MetadataRoute.Sitemap =>
  createSitemapEntriesFromRoutes(getAppSiteUrl(), ROUTES);

export default sitemap;
