"use client";

import { useEffect, useRef } from "react";

type AdSensePlaceholderProps = {
  slotId: string;
  className?: string;
};

const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
const adSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID;

export const AdSensePlaceholder = ({ slotId, className = "" }: AdSensePlaceholderProps) => {
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
      <div
        className={`border-ink-muted/30 text-ink-muted rounded-lg border border-dashed p-4 text-center text-xs ${className}`}
      >
        AdSense placeholder ({slotId}) — set NEXT_PUBLIC_ADSENSE_CLIENT_ID and
        NEXT_PUBLIC_ADSENSE_SLOT_ID
      </div>
    );
  }

  return (
    <div
      className={`flex min-h-[50px] w-full justify-center overflow-hidden ${className}`}
      aria-label="advertisement"
    >
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "inline-block", width: "100%", minHeight: 50 }}
        data-ad-client={clientId}
        data-ad-slot={adSlot}
      />
    </div>
  );
};
