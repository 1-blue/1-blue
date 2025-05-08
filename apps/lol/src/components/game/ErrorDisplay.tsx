import Link from "next/link";
import { Button } from "@1-blue/ui/components/button";
import routeMap from "#src/libs/routeMap";

interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay = ({ message }: ErrorDisplayProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh bg-gradient-to-b from-background to-muted/50 text-foreground p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-destructive mb-4">오류 발생</h1>
        <p className="text-muted-foreground mb-6">{message}</p>
        <Link
          href={routeMap.home.index}
          className="block w-full max-w-xs mx-auto"
        >
          <Button className="w-full" variant="outline">
            메인으로 돌아가기
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ErrorDisplay;
