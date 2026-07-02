import { ArchiveDetailPage } from "@/app/archive/[date]/_components/ArchiveDetailPage";

type PageProps = {
  params: Promise<{ date: string }>;
};

const Page = async ({ params }: PageProps) => {
  const { date } = await params;
  return <ArchiveDetailPage boardDate={date} />;
};

export default Page;
