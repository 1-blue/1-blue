import type { Metadata } from "next";
import { createSiteMetadata } from "@1-blue/seo";
import { resolveCategoryFromSlug } from "@1-blue/core/sseoltalk";
import { SITE_KEYWORDS } from "@/app/_config/site-seo";
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/app/_components/SeoJsonLd";
import { CATEGORY_SEO } from "@/app/_config/seo-helpers";
import { getAppSiteUrl } from "@/app/_config/site-url";
import { CategoryPageClient } from "@/app/category/[name]/CategoryPageClient";
import { listPublishedStories } from "@/lib/repository";

type PageProps = {
  params: Promise<{ name: string }>;
};

export const revalidate = 300;

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { name } = await params;
  const category = resolveCategoryFromSlug(name);
  const title = category ? `${category} 카톡 썰` : "카테고리 썰";
  const seo = category ? CATEGORY_SEO[category] : null;
  const description = seo?.description ?? "카테고리별 썰 목록";

  return createSiteMetadata({
    title,
    description,
    path: `/category/${name}`,
    siteUrl: getAppSiteUrl(),
    keywords: seo ? [...SITE_KEYWORDS, ...seo.keywords] : [...SITE_KEYWORDS],
  });
};

const CategoryPage = async ({ params }: PageProps) => {
  const { name } = await params;
  const category = resolveCategoryFromSlug(name);

  if (!category) {
    return <CategoryPageClient slug={name} />;
  }

  const { items } = await listPublishedStories({ category });

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "홈", path: "/" },
          { name: `${category} 썰`, path: `/category/${name}` },
        ]}
      />
      <ItemListJsonLd
        name={`${category} 카톡 썰`}
        items={items.slice(0, 10).map((item) => ({ id: item.id, title: item.title }))}
      />
      <CategoryPageClient slug={name} initialItems={items} />
    </>
  );
};

export default CategoryPage;
