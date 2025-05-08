import { getSupabaseFromAnnoRole } from "@1-blue/supabase";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { useMemo } from "react";

const useSkins = () => {
  const supabase = getSupabaseFromAnnoRole();

  const {
    data: skins,
    isLoading,
    error,
  } = useQuery(supabase.schema("lol").from("champion_skins").select("*"));

  const shuffledSkins = useMemo(() => {
    if (!skins) return [];
    return skins.sort(() => Math.random() - 0.5);
  }, [skins]);

  return { skins, shuffledSkins, isLoading, error };
};

export default useSkins;
