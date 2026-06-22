type StitchProgressBarProps = {
  percent: number;
  label?: string;
  rightLabel?: string;
};

export const StitchProgressBar = ({ percent, label, rightLabel }: StitchProgressBarProps) => {
  return (
    <div className="space-y-2">
      {(label || rightLabel) && (
        <div className="flex items-center justify-between text-sm font-semibold">
          <span>{label}</span>
          {rightLabel && <span className="text-ink/70">{rightLabel}</span>}
        </div>
      )}
      <div className="candy-progress">
        <div className="candy-progress-fill" style={{ width: `${Math.min(100, percent)}%` }} />
      </div>
    </div>
  );
};
