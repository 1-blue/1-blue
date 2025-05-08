import Link from "next/link";
import { Separator } from "@1-blue/ui/components/separator";
import routeMap from "#src/libs/routeMap";

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t mt-auto">
      <div className="container mx-auto px-6 py-8 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
        <div className="mb-4 sm:mb-0">
          <p>&copy; 2025 박상은(1-blue) All rights reserved</p>
        </div>
        <nav className="flex items-center gap-x-4 sm:gap-x-6">
          <Link
            href={routeMap.privacy.index}
            className="hover:text-primary transition-colors"
          >
            저작권 처리 방침
          </Link>
          <Separator orientation="vertical" className="h-4 hidden sm:block" />
          <Link
            href={routeMap.openKakao.index}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            오픈 채팅방
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
