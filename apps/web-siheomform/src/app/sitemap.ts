import type { MetadataRoute } from "next";
import { createSitemapEntriesFromRoutes } from "@1-blue/seo";
import { ROUTES } from "@/app/_constants/routes";
import { getAppSiteUrl } from "@/app/_config/site-url";
import { listPublicCbts } from "@/lib/repository";

export const revalidate = 3600;

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const siteUrl = getAppSiteUrl();
  const staticEntries = createSitemapEntriesFromRoutes(siteUrl, ROUTES);

  try {
    const publicCbts = await listPublicCbts("recent");
    const base = siteUrl.replace(/\/$/, "");
    const cbtEntries: MetadataRoute.Sitemap = publicCbts.map((cbt) => ({
      url: `${base}${ROUTES.CBT.DETAIL.path(cbt.publicId)}`,
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
