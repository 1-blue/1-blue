type AdSensePlaceholderProps = {
  slotId: string;
};

export const AdSensePlaceholder = ({ slotId }: AdSensePlaceholderProps) => {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  if (!clientId) {
    return (
      <div className="border-muted bg-muted/30 text-muted-foreground rounded-lg border border-dashed p-4 text-center text-xs">
        AdSense placeholder ({slotId}) — set NEXT_PUBLIC_ADSENSE_CLIENT_ID
      </div>
    );
  }

  return (
    <div className="text-muted-foreground text-center text-xs">
      AdSense slot: {slotId} (client: {clientId})
    </div>
  );
};
