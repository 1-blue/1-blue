"use client";

import { useCallback, useState } from "react";
import { Button } from "@1-blue/ui/components/button";
import { Loader2, Upload, X } from "lucide-react";

type ImageUploadFieldProps = {
  label: string;
  value: string | null;
  onChange: (url: string | null) => void;
};

const ACCEPT = "image/jpeg,image/png,image/gif,image/webp";

export const ImageUploadField = ({ label, value, onChange }: ImageUploadFieldProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      setError(null);
      setIsUploading(true);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = (await response.json()) as { url?: string; error?: string };

        if (!response.ok) {
          throw new Error(data.error ?? "업로드에 실패했습니다.");
        }

        if (!data.url) {
          throw new Error("업로드 URL을 받지 못했습니다.");
        }

        onChange(data.url);
      } catch (uploadError) {
        const message =
          uploadError instanceof Error ? uploadError.message : "업로드에 실패했습니다.";
        setError(message);
      } finally {
        setIsUploading(false);
      }
    },
    [onChange],
  );

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const file = files?.[0];
      if (file) {
        void uploadFile(file);
      }
    },
    [uploadFile],
  );

  return (
    <div className="space-y-2">
      <p className="text-muted-foreground text-xs font-medium">{label}</p>
      {value ? (
        <div className="border-border relative overflow-hidden rounded-lg border">
          <img src={value} alt="" className="max-h-40 w-full object-contain" />
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="absolute top-2 right-2 h-7 w-7"
            onClick={() => onChange(null)}
            aria-label="이미지 삭제"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <label
          className="border-border hover:border-primary/50 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-6 text-center transition-colors"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFiles(e.dataTransfer.files);
          }}
        >
          <input
            type="file"
            accept={ACCEPT}
            className="sr-only"
            disabled={isUploading}
            onChange={(e) => handleFiles(e.target.files)}
          />
          {isUploading ? (
            <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
          ) : (
            <Upload className="text-muted-foreground h-5 w-5" />
          )}
          <span className="text-muted-foreground text-xs">
            {isUploading ? "업로드 중…" : "클릭 또는 드래그하여 이미지 업로드"}
          </span>
        </label>
      )}
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  );
};
