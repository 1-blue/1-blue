import { getTermsSections } from "@1-blue/legal/content";
import { createLegalPageProps } from "@1-blue/legal/operator";
import { LegalPageLayout } from "@/app/_components/LegalPageLayout";

const TermsPage = () => {
  const sections = getTermsSections(
    createLegalPageProps({
      serviceName: "오늘의 추론",
      effectiveDate: "2026-06-24",
    }),
  );

  return (
    <LegalPageLayout title="이용약관">
      {sections.map((section) => (
        <section key={section.title}>
          <h2 className="mb-2 font-semibold">{section.title}</h2>
          <p className="text-ink-muted text-sm">{section.body}</p>
        </section>
      ))}
    </LegalPageLayout>
  );
};

export default TermsPage;
