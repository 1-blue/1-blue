import { getSupabaseFromAnnoRole } from "@1-blue/supabase";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";

interface UseSkinArgs {
  skinName?: string;
}

const useSkin = ({ skinName }: UseSkinArgs) => {
  const supabase = getSupabaseFromAnnoRole();

  const {
    data: skin,
    isLoading,
    error,
  } = useQuery(
    supabase
      .schema("lol")
      .from("champion_skins")
      .select("*")
      .eq("skin_name", skinName!)
      .single(),
    {
      enabled: !!skinName,
    }
  );

  return { skin, isLoading, error };
};

export default useSkin;
