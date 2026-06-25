import { Suspense } from "react";
import CompletePageInner from "@/app/create/complete/CompletePageInner";

const CompletePage = () => {
  return (
    <Suspense fallback={<p className="p-6 text-center text-sm">불러오는 중…</p>}>
      <CompletePageInner />
    </Suspense>
  );
};

export default CompletePage;
