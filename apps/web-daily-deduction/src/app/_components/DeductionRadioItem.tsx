"use client";

import { RadioGroupItem } from "@1-blue/ui/components/radio-group";
import { cn } from "@1-blue/ui/lib/index";
import type { ComponentProps } from "react";

type DeductionRadioItemProps = ComponentProps<typeof RadioGroupItem>;

export const DeductionRadioItem = ({ className, ...props }: DeductionRadioItemProps) => {
  return (
    <RadioGroupItem
      className={cn(
        "border-white/40 text-accent",
        "data-[state=checked]:border-accent-bright data-[state=checked]:text-accent-bright",
        "focus-visible:border-accent-bright focus-visible:ring-accent-bright/40",
        "[&_[data-slot=radio-group-indicator]_svg]:fill-accent-bright",
        "[&_[data-slot=radio-group-indicator]_svg]:size-2.5",
        className,
      )}
      {...props}
    />
  );
};
