import type { MetadataRoute } from "next";
import { createSitemapEntriesFromRoutes } from "@1-blue/seo";
import { ROUTES } from "@/app/_constants/routes";
import { getAppSiteUrl } from "@/app/_config/site-url";
import { getPublishedStoriesForSitemap } from "@/lib/repository";

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const siteUrl = getAppSiteUrl();
  const staticEntries = createSitemapEntriesFromRoutes(siteUrl, ROUTES);

  try {
    const stories = await getPublishedStoriesForSitemap();
    const base = siteUrl.replace(/\/$/, "");
    const storyEntries: MetadataRoute.Sitemap = stories.map((story) => ({
      url: `${base}${ROUTES.STORY.DETAIL.path(story.id)}`,
      lastModified: story.publishedAt ? new Date(story.publishedAt) : undefined,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
    return [...staticEntries, ...storyEntries];
  } catch {
    return staticEntries;
  }
};

export default sitemap;
