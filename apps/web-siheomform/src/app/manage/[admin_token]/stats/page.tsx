import { ROUTES } from "@/app/_constants/routes";
import { redirect } from "next/navigation";

type StatsPageProps = {
  params: Promise<{ admin_token: string }>;
};

const StatsPage = async ({ params }: StatsPageProps) => {
  const { admin_token } = await params;
  redirect(ROUTES.MANAGE.DETAIL.path(admin_token));
};

export default StatsPage;
