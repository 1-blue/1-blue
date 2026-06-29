import type { Metadata } from "next";
import { createSiteMetadata } from "@1-blue/seo";
import { SITE_KEYWORDS } from "@/app/_config/site-seo";
import { getAppSiteUrl } from "@/app/_config/site-url";
import { RandomPageClient } from "@/app/random/RandomPageClient";

export const metadata: Metadata = {
  ...createSiteMetadata({
    title: "랜덤 썰",
    description: "무작위로 추천되는 카톡 스타일 썰을 읽어보세요.",
    path: "/random",
    siteUrl: getAppSiteUrl(),
    keywords: [...SITE_KEYWORDS],
  }),
  robots: { index: false, follow: false },
};

const RandomPage = () => <RandomPageClient />;

export default RandomPage;
