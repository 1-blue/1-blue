const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:7005";

export const getAppSiteUrl = () => siteUrl;
