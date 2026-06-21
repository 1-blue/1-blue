import * as React from "react";
import { cn } from "@1-blue/ui/lib/cn";

export const Card = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    className={cn("bg-card text-card-foreground rounded-xl border shadow-sm", className)}
    {...props}
  />
);

export const CardHeader = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div className={cn("flex flex-col gap-1.5 p-6", className)} {...props} />
);

export const CardTitle = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div className={cn("leading-none font-semibold tracking-tight", className)} {...props} />
);

export const CardDescription = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div className={cn("text-muted-foreground text-sm", className)} {...props} />
);

export const CardContent = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div className={cn("p-6 pt-0", className)} {...props} />
);

export const CardFooter = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div className={cn("flex items-center p-6 pt-0", className)} {...props} />
);
