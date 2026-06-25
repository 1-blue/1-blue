import type { MetadataRoute } from "next";
import { createSitemapEntries } from "@1-blue/seo";
import { SITEMAP_PATHS } from "@/app/_config/site-seo";
import { getAppSiteUrl } from "@/app/_config/site-url";
import { listPublicCbts } from "@/lib/repository";

export const revalidate = 3600;

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const siteUrl = getAppSiteUrl();
  const staticEntries = createSitemapEntries(siteUrl, [...SITEMAP_PATHS]);

  try {
    const publicCbts = await listPublicCbts("recent");
    const base = siteUrl.replace(/\/$/, "");
    const cbtEntries: MetadataRoute.Sitemap = publicCbts.map((cbt) => ({
      url: `${base}/cbt/${cbt.publicId}`,
      lastModified: new Date(cbt.updatedAt),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
    return [...staticEntries, ...cbtEntries];
  } catch {
    return staticEntries;
  }
};

export default sitemap;
