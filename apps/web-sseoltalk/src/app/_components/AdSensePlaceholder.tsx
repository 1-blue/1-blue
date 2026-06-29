"use client";

import { useEffect, useRef } from "react";

type AdSensePlaceholderProps = {
  slotId: string;
  adSlot?: string;
};

const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
const defaultAdSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID;

export const AdSensePlaceholder = ({ slotId, adSlot }: AdSensePlaceholderProps) => {
  const insRef = useRef<HTMLModElement>(null);
  const resolvedSlot = adSlot ?? defaultAdSlot;

  useEffect(() => {
    if (!clientId || !resolvedSlot || !insRef.current) {
      return;
    }

    if (insRef.current.getAttribute("data-adsbygoogle-status")) {
      return;
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense may throw if script is not loaded yet.
    }
  }, [resolvedSlot]);

  if (!clientId || !resolvedSlot) {
    return (
      <div className="border-muted bg-muted/30 text-muted-foreground rounded-lg border border-dashed p-4 text-center text-xs">
        광고 영역 ({slotId})
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden" aria-label="advertisement">
      <ins
        ref={insRef}
        className="adsbygoogle block w-full"
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={resolvedSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};
