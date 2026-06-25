import { redirect } from "next/navigation";

type StatsPageProps = {
  params: Promise<{ admin_token: string }>;
};

const StatsPage = async ({ params }: StatsPageProps) => {
  const { admin_token } = await params;
  redirect(`/manage/${admin_token}`);
};

export default StatsPage;
