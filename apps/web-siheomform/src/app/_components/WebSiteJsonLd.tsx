import { SITE_DESCRIPTION, SITE_NAME } from "@/app/_config/site-seo";
import { getAppSiteUrl } from "@/app/_config/site-url";

export const WebSiteJsonLd = () => {
  const siteUrl = getAppSiteUrl().replace(/\/$/, "");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: siteUrl,
    description: SITE_DESCRIPTION,
    inLanguage: "ko-KR",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};
