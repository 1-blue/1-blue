import type { NextPage } from "next";
import { Button } from "@1-blue/ui/components/button";

const Page: NextPage = () => {
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello World</h1>
        <Button size="sm">Button</Button>
      </div>
    </div>
  );
};

export default Page;
