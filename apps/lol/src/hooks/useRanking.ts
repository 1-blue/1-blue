import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import useSupabaseBrowser from "#src/supabase/supabasae-browser";

const useRanking = () => {
  const supabase = useSupabaseBrowser();

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
