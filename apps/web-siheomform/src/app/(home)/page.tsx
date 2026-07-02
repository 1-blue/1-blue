import type { Metadata } from "next";
import { createSiteMetadata } from "@1-blue/seo";
import { HomePage } from "@/app/(home)/_components/HomePage";
import { WebSiteJsonLd } from "@/app/_components/WebSiteJsonLd";
import { SITE_DESCRIPTION, SITE_KEYWORDS, SITE_TITLE } from "@/app/_config/site-seo";
import { getAppSiteUrl } from "@/app/_config/site-url";

export const metadata: Metadata = createSiteMetadata({
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  siteUrl: getAppSiteUrl(),
  keywords: [...SITE_KEYWORDS],
});

const Page = () => {
  return (
    <>
      <WebSiteJsonLd />
      <HomePage />
    </>
  );
};

export default Page;
