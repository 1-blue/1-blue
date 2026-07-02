"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@1-blue/ui/components/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@1-blue/ui/components/dialog";

type QrCodeCardProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  qrUrl: string;
};

export const QrCodeCard = ({ open, onOpenChange, title, qrUrl }: QrCodeCardProps) => {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setDataUrl(qrUrl);
  }, [open, qrUrl]);

  const handleDownload = () => {
    if (!dataUrl) {
      return;
    }

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${title}-qr.png`;
    link.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-paper max-w-sm">
        <DialogHeader>
          <DialogTitle>{title} QR</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          {dataUrl ? (
            <img
              src={dataUrl}
              alt={`${title} QR 코드`}
              className="rounded-lg border bg-white p-2"
            />
          ) : (
            <div className="bg-muted h-64 w-64 animate-pulse rounded-lg" />
          )}
          <Button type="button" variant="outline" onClick={handleDownload} disabled={!dataUrl}>
            <Download className="mr-1 size-4" />
            PNG 저장
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
