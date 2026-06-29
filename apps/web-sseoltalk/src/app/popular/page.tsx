import type { Metadata } from "next";
import { createSiteMetadata } from "@1-blue/seo";
import {
  POPULAR_PAGE_DESCRIPTION,
  POPULAR_PAGE_TITLE,
  SITE_KEYWORDS,
} from "@/app/_config/site-seo";
import { ItemListJsonLd } from "@/app/_components/SeoJsonLd";
import { getAppSiteUrl } from "@/app/_config/site-url";
import { PopularPageClient } from "@/app/popular/PopularPageClient";
import { listPopularToday } from "@/lib/repository";

export const revalidate = 300;

export const metadata: Metadata = createSiteMetadata({
  title: POPULAR_PAGE_TITLE,
  description: POPULAR_PAGE_DESCRIPTION,
  path: "/popular",
  siteUrl: getAppSiteUrl(),
  keywords: [...SITE_KEYWORDS, "인기 썰 순위", "오늘의 인기 썰"],
});

const PopularPage = async () => {
  const items = await listPopularToday();

  return (
    <>
      <ItemListJsonLd
        name="인기 썰"
        items={items.map((item) => ({ id: item.id, title: item.title }))}
      />
      <PopularPageClient initialItems={items} />
    </>
  );
};

export default PopularPage;
