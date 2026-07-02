import { ROUTES } from "@/app/_constants/routes";
import type { Metadata } from "next";
import { createSiteMetadata } from "@1-blue/seo";
import { getPrivacyPolicySections } from "@1-blue/legal/content";
import { createLegalPageProps } from "@1-blue/legal/operator";
import {
  PRIVACY_PAGE_DESCRIPTION,
  PRIVACY_PAGE_TITLE,
  SITE_KEYWORDS,
} from "@/app/_config/site-seo";
import { LegalPageLayout } from "@/app/_components/LegalPageLayout";
import { getAppSiteUrl } from "@/app/_config/site-url";

export const metadata: Metadata = createSiteMetadata({
  title: PRIVACY_PAGE_TITLE,
  description: PRIVACY_PAGE_DESCRIPTION,
  path: ROUTES.PRIVACY.path,
  siteUrl: getAppSiteUrl(),
  keywords: [...SITE_KEYWORDS],
});

const PrivacyPage = () => {
  const sections = getPrivacyPolicySections(
    createLegalPageProps({
      serviceName: "시험폼",
      effectiveDate: "2026-01-01",
    }),
  );

  return (
    <LegalPageLayout title="개인정보처리방침">
      {sections.map((section) => (
        <section key={section.title}>
          <h2 className="mb-2 font-semibold">{section.title}</h2>
          <p className="text-muted-foreground text-sm">{section.body}</p>
        </section>
      ))}
    </LegalPageLayout>
  );
};

export default PrivacyPage;
