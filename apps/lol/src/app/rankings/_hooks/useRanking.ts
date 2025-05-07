import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { getSupabaseFromAnnoRole } from "@1-blue/supabase";

const useRanking = () => {
  const supabase = getSupabaseFromAnnoRole();

  const {
    data: rankings,
    isLoading,
    error,
  } = useQuery(
    supabase
      .schema("lol")
      .from("rankings")
      .select("id, nickname, score, completion_time, created_at, quiz_type")
      .order("score", { ascending: false })
      .order("completion_time", { ascending: true })
      .limit(10)
  );

  return { rankings, isLoading, error };
};

export default useRanking;
