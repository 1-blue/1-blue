import { ArchiveDetailPage } from "@/app/_components/ArchiveDetailPage";

type PageProps = {
  params: Promise<{ date: string }>;
};

const Page = async ({ params }: PageProps) => {
  const { date } = await params;
  return <ArchiveDetailPage boardDate={date} />;
};

export default Page;
