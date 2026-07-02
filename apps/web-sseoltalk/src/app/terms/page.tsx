import { ROUTES } from "@/app/_constants/routes";
import type { Metadata } from "next";
import { createSiteMetadata } from "@1-blue/seo";
import { getTermsSections } from "@1-blue/legal/content";
import { createLegalPageProps } from "@1-blue/legal/operator";
import { SITE_KEYWORDS, TERMS_PAGE_DESCRIPTION, TERMS_PAGE_TITLE } from "@/app/_config/site-seo";
import { LegalPageLayout } from "@/app/_components/LegalPageLayout";
import { getAppSiteUrl } from "@/app/_config/site-url";

export const metadata: Metadata = createSiteMetadata({
  title: TERMS_PAGE_TITLE,
  description: TERMS_PAGE_DESCRIPTION,
  path: ROUTES.TERMS.path,
  siteUrl: getAppSiteUrl(),
  keywords: [...SITE_KEYWORDS],
});

const TermsPage = () => {
  const sections = getTermsSections(
    createLegalPageProps({
      serviceName: "썰톡",
      effectiveDate: "2026-06-29",
    }),
  );

  return (
    <LegalPageLayout title="이용약관">
      {sections.map((section) => (
        <section key={section.title}>
          <h2 className="mb-2 font-semibold">{section.title}</h2>
          <p className="text-text-secondary text-sm">{section.body}</p>
        </section>
      ))}
    </LegalPageLayout>
  );
};

export default TermsPage;
