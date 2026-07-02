import type { Metadata } from "next";
import { createSiteMetadata } from "@1-blue/seo";
import { StoryFeed } from "@/app/(home)/_components/StoryFeed";
import { FaqJsonLd } from "@/app/(home)/_components/FaqJsonLd";
import { ItemListJsonLd } from "@/app/_components/SeoJsonLd";
import { WebSiteJsonLd } from "@/app/_components/WebSiteJsonLd";
import { FAQ_ITEMS, SITE_DESCRIPTION, SITE_KEYWORDS, SITE_TITLE } from "@/app/_config/site-seo";
import { getAppSiteUrl } from "@/app/_config/site-url";
import { listPopularToday, listPublishedStories } from "@/lib/repository";

export const revalidate = 300;

export const metadata: Metadata = {
  ...createSiteMetadata({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteUrl: getAppSiteUrl(),
    keywords: [...SITE_KEYWORDS],
  }),
  title: { absolute: SITE_TITLE },
};

const Page = async () => {
  const [{ items, nextCursor }, popularItems] = await Promise.all([
    listPublishedStories(),
    listPopularToday(),
  ]);

  return (
    <>
      <WebSiteJsonLd />
      <FaqJsonLd items={[...FAQ_ITEMS]} />
      <ItemListJsonLd
        name="최신 썰"
        items={items.slice(0, 10).map((item) => ({ id: item.id, title: item.title }))}
      />
      <StoryFeed
        showPopular
        title="최신 썰"
        subtitle="방금 올라온 카톡 스타일 썰을 끝까지 읽어보세요"
        initialItems={items}
        initialCursor={nextCursor}
        initialPopularItems={popularItems}
      />
    </>
  );
};

export default Page;
