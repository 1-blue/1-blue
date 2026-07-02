"use client";

import { useEffect, useRef } from "react";

type AdSensePlaceholderProps = {
  slotId: string;
};

const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
const adSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID;

export const AdSensePlaceholder = ({ slotId }: AdSensePlaceholderProps) => {
  const insRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    if (!clientId || !adSlot || !insRef.current) {
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
  }, []);

  if (!clientId || !adSlot) {
    return (
      <div className="border-muted bg-muted/30 text-muted-foreground rounded-lg border border-dashed p-4 text-center text-xs">
        AdSense placeholder ({slotId}) — set NEXT_PUBLIC_ADSENSE_CLIENT_ID and
        NEXT_PUBLIC_ADSENSE_SLOT_ID
      </div>
    );
  }

  return (
    <div
      className="flex min-h-[50px] w-full justify-center overflow-hidden"
      aria-label="advertisement"
    >
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "inline-block", width: 1024, height: 50 }}
        data-ad-client={clientId}
        data-ad-slot={adSlot}
      />
    </div>
  );
};
