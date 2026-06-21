export type SiteMetadataInput = {
  title: string;
  description: string;
  path?: string;
  siteUrl: string;
};

export const createSiteMetadata = ({
  title,
  description,
  path = "",
  siteUrl,
}: SiteMetadataInput) => {
  const url = `${siteUrl.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;

  return {
    title,
    description,
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

export const createSitemapEntries = (
  siteUrl: string,
  paths: string[],
): Array<{ url: string; lastModified: Date }> => {
  const base = siteUrl.replace(/\/$/, "");
  return paths.map((path) => ({
    url: `${base}${path.startsWith("/") ? path : `/${path}`}`,
    lastModified: new Date(),
  }));
};
