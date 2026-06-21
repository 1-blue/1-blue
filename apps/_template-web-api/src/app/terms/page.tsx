import { getTermsSections } from "@1-blue/legal/content";

const TermsPage = () => {
  const sections = getTermsSections({
    serviceName: "{{APP_NAME}}",
    contactEmail: "contact@example.com",
    effectiveDate: "2026-01-01",
  });

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">Terms of Service</h1>
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
