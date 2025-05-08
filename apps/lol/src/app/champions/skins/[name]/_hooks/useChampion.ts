import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { getSupabaseFromAnnoRole } from "@1-blue/supabase";

interface UseChampionArgs {
  championName?: string;
}

const useChampion = ({ championName }: UseChampionArgs) => {
  const supabase = getSupabaseFromAnnoRole();

  const {
    data: champion,
    isLoading,
    error,
  } = useQuery(
    supabase
      .schema("lol")
      .from("champions")
      .select("*")
      .eq("name", championName!)
      .single(),
    {
      enabled: !!championName,
    }
  );

  return { champion, isLoading, error };
};

export default useChampion;
