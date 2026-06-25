type StatusBadgeProps = {
  status: "draft" | "active" | "public" | "private";
};

const styles: Record<StatusBadgeProps["status"], string> = {
  draft: "bg-muted text-muted-foreground",
  active: "bg-emerald-100 text-emerald-700",
  public: "bg-blue-100 text-blue-700",
  private: "bg-muted text-muted-foreground",
};

const labels: Record<StatusBadgeProps["status"], string> = {
  draft: "DRAFT",
  active: "ACTIVE",
  public: "공개",
  private: "비공개",
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  return (
    <span className={`rounded px-2 py-0.5 text-[10px] font-bold tracking-wide ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};
