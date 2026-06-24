import { createFaqJsonLd, type FaqItem } from "@1-blue/seo";

type FaqJsonLdProps = {
  items: FaqItem[];
};

export const FaqJsonLd = ({ items }: FaqJsonLdProps) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(createFaqJsonLd(items)) }}
  />
);
