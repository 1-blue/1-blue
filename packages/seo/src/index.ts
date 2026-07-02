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

type SitemapMetadata = Pick<SitemapEntry, "changeFrequency" | "priority">;

type RouteNode = {
  path?: string | ((...args: never[]) => string);
  sitemap?: SitemapMetadata;
  [key: string]: unknown;
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

/** ROUTES에서 공개 정적 경로만 수집한다. 동적 builder와 외부 URL은 제외한다. */
export const createSitemapEntriesFromRoutes = (
  siteUrl: string,
  routes: RouteNode,
): SitemapEntry[] => {
  const base = siteUrl.replace(/\/$/, "");
  const entries: SitemapEntry[] = [];

  const visit = (node: unknown) => {
    if (!node || typeof node !== "object" || Array.isArray(node)) return;

    const route = node as RouteNode;
    if (typeof route.path === "string" && route.path.startsWith("/") && route.sitemap) {
      entries.push({ url: `${base}${route.path}`, ...route.sitemap });
    }

    for (const [key, child] of Object.entries(route)) {
      if (key !== "sitemap") visit(child);
    }
  };

  visit(routes);
  return entries;
};
