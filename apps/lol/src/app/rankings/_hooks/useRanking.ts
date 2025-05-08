import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { getSupabaseFromAnnoRole } from "@1-blue/supabase";

const useRanking = (limit = 100) => {
  const supabase = getSupabaseFromAnnoRole();

  const {
    data: multipleChoiceRankings,
    isLoading: multipleChoiceLoading,
    error: multipleChoiceError,
  } = useQuery(
    supabase
      .schema("lol")
      .from("rankings")
      .select("id, nickname, score, completion_time, created_at, quiz_type")
      .eq("quiz_type", "multiple-choice")
      .order("score", { ascending: false })
      .order("completion_time", { ascending: true })
      .limit(limit)
  );

  const {
    data: shortAnswerRankings,
    isLoading: shortAnswerLoading,
    error: shortAnswerError,
  } = useQuery(
    supabase
      .schema("lol")
      .from("rankings")
      .select("id, nickname, score, completion_time, created_at, quiz_type")
      .eq("quiz_type", "short-answer")
      .order("score", { ascending: false })
      .order("completion_time", { ascending: true })
      .limit(limit)
  );

  return {
    multipleChoiceRankings,
    shortAnswerRankings,
    isLoading: multipleChoiceLoading || shortAnswerLoading,
    error: multipleChoiceError || shortAnswerError,
  };
};

export default useRanking;
