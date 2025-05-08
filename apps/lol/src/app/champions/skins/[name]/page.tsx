import { getSupabaseFromAnnoRole } from "@1-blue/supabase";
import type { NextPage } from "next";
import SkinPage from "./_components/SkinPage";

interface IProps {
  params: Promise<{
    name: string;
  }>;
}

export const generateMetadata = async ({ params }: IProps) => {
  const { name } = await params;

  const parsedName = decodeURIComponent(name);

  const supabase = getSupabaseFromAnnoRole();
  const { data: skin } = await supabase
    .schema("lol")
    .from("champion_skins")
    .select("*")
    .eq("skin_name", parsedName)
    .single();

  if (!skin) return {};

  const { data: champion } = await supabase
    .schema("lol")
    .from("champions")
    .select("*")
    .eq("name", skin.champion_name)
    .single();

  if (!champion) return {};

  return {
    title: `${parsedName} - 리그오브레전드 퀴즈`,
    description: `[리그오브레전드 퀴즈] ${champion.blurb}`,
    openGraph: {
      title: `${parsedName} - 리그오브레전드 퀴즈`,
      description: `[리그오브레전드 퀴즈] ${champion.blurb}`,
      images: [skin.splash_image_url],
    },
  };
};

const Page: NextPage<IProps> = async () => {
  return <SkinPage />;
};

export default Page;
