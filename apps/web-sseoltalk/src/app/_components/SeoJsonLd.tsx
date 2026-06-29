import { getAppSiteUrl } from "@/app/_config/site-url";

type ArticleJsonLdProps = {
  id: string;
  title: string;
  category: string;
  publishedAt: string | null;
  description: string;
};

export const ArticleJsonLd = ({
  id,
  title,
  category,
  publishedAt,
  description,
}: ArticleJsonLdProps) => {
  const siteUrl = getAppSiteUrl().replace(/\/$/, "");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    articleSection: category,
    datePublished: publishedAt ?? undefined,
    inLanguage: "ko-KR",
    url: `${siteUrl}/story/${id}`,
    publisher: {
      "@type": "Organization",
      name: "썰톡",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

type ItemListJsonLdProps = {
  name: string;
  items: Array<{ id: string; title: string }>;
};

export const ItemListJsonLd = ({ name, items }: ItemListJsonLdProps) => {
  const siteUrl = getAppSiteUrl().replace(/\/$/, "");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.title,
      url: `${siteUrl}/story/${item.id}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

type BreadcrumbJsonLdProps = {
  items: Array<{ name: string; path: string }>;
};

export const BreadcrumbJsonLd = ({ items }: BreadcrumbJsonLdProps) => {
  const siteUrl = getAppSiteUrl().replace(/\/$/, "");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};
