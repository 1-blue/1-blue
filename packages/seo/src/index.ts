export type FaqItem = {
  question: string;
  answer: string;
};

export type SiteMetadataInput = {
  title: string;
  description: string;
  path?: string;
  siteUrl: string;
  keywords?: string[];
};

export type SitemapEntry = {
  url: string;
  lastModified?: Date;
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
};

export const createSiteMetadata = ({
  title,
  description,
  path = "",
  siteUrl,
  keywords,
}: SiteMetadataInput) => {
  const url = `${siteUrl.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;

  return {
    title,
    description,
    ...(keywords?.length ? { keywords } : {}),
    metadataBase: new URL(siteUrl),
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website" as const,
    },
  };
};

export const createFaqJsonLd = (items: FaqItem[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
});

export const createSitemapEntries = (
  siteUrl: string,
  paths: string[],
  options?: {
    changeFrequency?: SitemapEntry["changeFrequency"];
    priority?: number;
  },
): SitemapEntry[] => {
  const base = siteUrl.replace(/\/$/, "");
  const { changeFrequency = "weekly", priority = 0.7 } = options ?? {};

  return paths.map((path) => ({
    url: `${base}${path.startsWith("/") ? path : `/${path}`}`,
    lastModified: new Date(),
    changeFrequency,
    priority: path === "/" ? 1 : priority,
  }));
};
