import { Button } from "@1-blue/ui/components/button";
import { ExternalLink } from "lucide-react";

type OpenLinkButtonProps = {
  href: string;
};

export const OpenLinkButton = ({ href }: OpenLinkButtonProps) => {
  return (
    <Button type="button" variant="outline" size="icon" asChild>
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label="새 탭에서 열기">
        <ExternalLink className="h-4 w-4" />
      </a>
    </Button>
  );
};
