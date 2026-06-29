import { cn } from "@1-blue/ui/lib/index";

type SseoltalkMarkProps = {
  className?: string;
};

export const SseoltalkMark = ({ className }: SseoltalkMarkProps) => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
      aria-hidden
    >
      <rect width="64" height="64" rx="16" fill="#8B7BFF" />
      <path
        d="M18 22c0-2.2 1.8-4 4-4h20c2.2 0 4 1.8 4 4v12c0 2.2-1.8 4-4 4H30l-8 8v-8h-4c-2.2 0-4-1.8-4-4V22z"
        fill="#0E1014"
        fillOpacity="0.92"
      />
      <circle cx="26" cy="30" r="2.5" fill="#8B7BFF" />
      <circle cx="34" cy="30" r="2.5" fill="#8B7BFF" />
      <circle cx="42" cy="30" r="2.5" fill="#8B7BFF" />
    </svg>
  );
};
