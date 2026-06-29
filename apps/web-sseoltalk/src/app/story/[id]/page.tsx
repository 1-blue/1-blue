import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createSiteMetadata } from "@1-blue/seo";
import { SITE_KEYWORDS } from "@/app/_config/site-seo";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/app/_components/SeoJsonLd";
import { buildStoryMetaDescription } from "@/app/_config/seo-helpers";
import { getAppSiteUrl } from "@/app/_config/site-url";
import { getStoryDetail, getStoryForMetadata } from "@/lib/repository";
import { StoryPageClient } from "@/app/story/[id]/StoryPageClient";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const revalidate = 60;

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { id } = await params;
  const story = await getStoryForMetadata(id);

  if (!story) {
    return createSiteMetadata({
      title: "썰을 찾을 수 없습니다",
      description: "요청한 썰을 찾을 수 없습니다.",
      path: `/story/${id}`,
      siteUrl: getAppSiteUrl(),
      keywords: [...SITE_KEYWORDS],
    });
  }

  const description = buildStoryMetaDescription({
    title: story.title,
    category: story.category,
    previewMessages: story.previewMessages,
  });

  return createSiteMetadata({
    title: story.title,
    description,
    path: `/story/${id}`,
    siteUrl: getAppSiteUrl(),
    keywords: [...SITE_KEYWORDS, story.category, "카톡 썰"],
  });
};

const StoryPage = async ({ params }: PageProps) => {
  const { id } = await params;
  const story = await getStoryDetail(id);

  if (!story) {
    notFound();
  }

  const description = buildStoryMetaDescription({
    title: story.title,
    category: story.category,
    previewMessages: story.messages.slice(0, 2).map((m) => ({
      sender: m.sender,
      isMe: m.isMe,
      content: m.content,
    })),
  });

  return (
    <>
      <ArticleJsonLd
        id={story.id}
        title={story.title}
        category={story.category}
        publishedAt={story.publishedAt}
        description={description}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "홈", path: "/" },
          { name: story.title, path: `/story/${id}` },
        ]}
      />
      <StoryPageClient storyId={id} initialStory={story} />
    </>
  );
};

export default StoryPage;
