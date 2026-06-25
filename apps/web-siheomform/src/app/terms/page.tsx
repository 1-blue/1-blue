import type { Metadata } from "next";
import { createSiteMetadata } from "@1-blue/seo";
import { getTermsSections } from "@1-blue/legal/content";
import { createLegalPageProps } from "@1-blue/legal/operator";
import {
  SITE_KEYWORDS,
  TERMS_PAGE_DESCRIPTION,
  TERMS_PAGE_TITLE,
} from "@/app/_config/site-seo";
import { getAppSiteUrl } from "@/app/_config/site-url";

export const metadata: Metadata = createSiteMetadata({
  title: TERMS_PAGE_TITLE,
  description: TERMS_PAGE_DESCRIPTION,
  path: "/terms",
  siteUrl: getAppSiteUrl(),
  keywords: [...SITE_KEYWORDS],
});

const TermsPage = () => {
  const sections = getTermsSections(
    createLegalPageProps({
      serviceName: "시험폼",
      effectiveDate: "2026-01-01",
    }),
  );

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">이용약관</h1>
      {sections.map((section) => (
        <section key={section.title}>
          <h2 className="mb-2 font-semibold">{section.title}</h2>
          <p className="text-muted-foreground text-sm">{section.body}</p>
        </section>
      ))}
    </main>
  );
};

export default TermsPage;
