import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { getSupabaseFromAnnoRole } from "@1-blue/supabase";

interface UseChampionArgs {
  championName: string;
  skinName: string;
}

// TODO: 각 챔피언 상세 조회 페이지 구현하기
const useChampion = ({ championName, skinName }: UseChampionArgs) => {
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
      .eq("name", championName)
  );

  return { champion, isLoading, error };
};

export default useChampion;
