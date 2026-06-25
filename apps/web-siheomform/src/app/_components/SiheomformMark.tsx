type SiheomformMarkProps = {
  size?: number;
  className?: string;
};

export const SiheomformMark = ({ size = 24, className = "" }: SiheomformMarkProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      fill="none"
      width={size}
      height={size}
      className={className}
      aria-hidden
    >
      <rect width="64" height="64" rx="14" fill="#2563EB" />
      <rect x="14" y="12" width="36" height="40" rx="4" fill="#fff" />
      <rect x="20" y="20" width="24" height="3" rx="1.5" fill="#BFDBFE" />
      <rect x="20" y="27" width="18" height="3" rx="1.5" fill="#BFDBFE" />
      <rect x="20" y="34" width="20" height="3" rx="1.5" fill="#BFDBFE" />
      <circle cx="24" cy="44" r="4" fill="#2563EB" />
      <circle cx="32" cy="44" r="4" stroke="#93C5FD" strokeWidth="2" />
      <circle cx="40" cy="44" r="4" stroke="#93C5FD" strokeWidth="2" />
    </svg>
  );
};
