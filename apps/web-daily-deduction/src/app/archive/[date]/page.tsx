import { ArchivePlayPage } from "@/app/_components/ArchivePlayPage";

type PageProps = {
  params: Promise<{ date: string }>;
};

const ArchiveDatePage = async ({ params }: PageProps) => {
  const { date } = await params;
  return <ArchivePlayPage date={date} />;
};

export default ArchiveDatePage;
