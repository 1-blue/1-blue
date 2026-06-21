const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:{{PORT}}";

export const getAppSiteUrl = () => siteUrl;
