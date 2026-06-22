import type { MetadataRoute } from "next";
import { createSitemapEntries } from "@1-blue/seo";
import { SITEMAP_PATHS } from "@/app/_config/site-seo";
import { getAppSiteUrl } from "@/app/_config/site-url";

export const dynamic = "force-static";

const sitemap = (): MetadataRoute.Sitemap =>
  createSitemapEntries(getAppSiteUrl(), [...SITEMAP_PATHS]);

export default sitemap;
