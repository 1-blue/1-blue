"use client";

import { Badge } from "@1-blue/ui/components/badge";

type PresenceBadgeProps = {
  count: number;
};

export const PresenceBadge = ({ count }: PresenceBadgeProps) => {
  return (
    <Badge className="bg-mint hover:bg-mint border-transparent px-2.5 py-1 text-xs font-semibold text-white">
      {count}명이 함께 그리는 중
    </Badge>
  );
};
