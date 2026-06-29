import type { MetadataRoute } from "next";
import { createSitemapEntries } from "@1-blue/seo";
import { SITEMAP_PATHS } from "@/app/_config/site-seo";
import { getAppSiteUrl } from "@/app/_config/site-url";
import { getPublishedStoriesForSitemap } from "@/lib/repository";

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const siteUrl = getAppSiteUrl();
  const staticEntries = createSitemapEntries(siteUrl, [...SITEMAP_PATHS]);

  try {
    const stories = await getPublishedStoriesForSitemap();
    const base = siteUrl.replace(/\/$/, "");
    const storyEntries: MetadataRoute.Sitemap = stories.map((story) => ({
      url: `${base}/story/${story.id}`,
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
