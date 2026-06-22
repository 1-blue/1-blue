import { getPrivacyPolicySections } from "@1-blue/legal/content";

const PrivacyPage = () => {
  const sections = getPrivacyPolicySections({
    serviceName: "온라인 종이뽑기",
    contactEmail: "contact@example.com",
    effectiveDate: "2026-06-22",
  });

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">개인정보처리방침</h1>
      {sections.map((section) => (
        <section key={section.title}>
          <h2 className="mb-2 font-semibold">{section.title}</h2>
          <p className="text-muted-foreground text-sm">{section.body}</p>
        </section>
      ))}
    </main>
  );
};

export default PrivacyPage;
