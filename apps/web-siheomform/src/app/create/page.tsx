import type { Metadata } from "next";
import { createSiteMetadata } from "@1-blue/seo";
import { CreatePageClient } from "@/app/create/_components/CreatePageClient";
import {
  CREATE_PAGE_DESCRIPTION,
  CREATE_PAGE_TITLE,
  SITE_KEYWORDS,
} from "@/app/_config/site-seo";
import { getAppSiteUrl } from "@/app/_config/site-url";

export const metadata: Metadata = createSiteMetadata({
  title: CREATE_PAGE_TITLE,
  description: CREATE_PAGE_DESCRIPTION,
  path: "/create",
  siteUrl: getAppSiteUrl(),
  keywords: [...SITE_KEYWORDS],
});

const CreatePage = () => {
  return <CreatePageClient />;
};

export default CreatePage;
