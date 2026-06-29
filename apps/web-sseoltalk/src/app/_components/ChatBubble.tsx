type ChatBubbleProps = {
  sender: string;
  content: string;
  isMe: boolean;
  showSender?: boolean;
};

export const ChatBubble = ({ sender, content, isMe, showSender = true }: ChatBubbleProps) => {
  if (isMe) {
    return (
      <div className="flex justify-end">
        <div className="bubble-me max-w-[82%] px-3.5 py-2.5 text-[15px] leading-relaxed whitespace-pre-wrap break-words">{content}</div>
      </div>
    );
  }

  return (
    <div className="flex gap-2.5">
      <div className="bg-primary/20 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
        {sender.slice(0, 1)}
      </div>
      <div className="min-w-0 max-w-[82%]">
        {showSender && <p className="text-text-secondary mb-1 text-[11px] font-medium">{sender}</p>}
        <div className="bubble-other px-3.5 py-2.5 text-[15px] leading-relaxed whitespace-pre-wrap break-words">{content}</div>
      </div>
    </div>
  );
};

export const ChatDateDivider = ({ label }: { label: string }) => (
  <div className="text-text-tertiary py-2 text-center text-[11px]">{label}</div>
);

export const ChatRoomHeader = ({
  title,
  subtitle,
  onBack,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
}) => (
  <div className="border-border bg-page-bg/95 sticky top-[var(--header-height)] z-40 border-b px-4 py-3 backdrop-blur-md">
    <div className="flex items-center gap-3">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="text-text-secondary hover:bg-surface-elevated flex h-9 w-9 items-center justify-center rounded-full text-lg"
          aria-label="뒤로"
        >
          ←
        </button>
      ) : null}
      <div className="min-w-0 flex-1 text-center">
        <h1 className="truncate text-[16px] font-semibold">{title}</h1>
        {subtitle && <p className="text-text-tertiary text-[11px]">{subtitle}</p>}
      </div>
      <span className="w-9" />
    </div>
  </div>
);
