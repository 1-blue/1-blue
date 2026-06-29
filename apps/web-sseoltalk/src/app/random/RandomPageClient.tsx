"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const RandomPageClient = () => {
  const router = useRouter();
  const [error, setError] = useState(false);

  useEffect(() => {
    const load = async () => {
      const response = await fetch("/api/random");
      if (!response.ok) {
        setError(true);
        return;
      }
      const data = (await response.json()) as { id: string };
      router.replace(`/story/${data.id}`);
    };
    void load();
  }, [router]);

  if (error) {
    return <p className="p-8 text-center text-sm">공개된 썰이 없습니다.</p>;
  }

  return <p className="p-8 text-center text-sm">랜덤 썰 불러오는 중…</p>;
};
