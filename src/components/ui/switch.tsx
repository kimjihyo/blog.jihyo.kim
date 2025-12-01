"use client";

import React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

interface SwitchProps
  extends React.ComponentProps<typeof SwitchPrimitive.Root> {
  thumbClassName?: string;
  iconChecked?: React.ReactNode;
  iconUnchecked?: React.ReactNode;
}

function Switch({
  className,
  iconChecked,
  iconUnchecked,
  thumbClassName,
  checked: checkedProp,
  onCheckedChange: onCheckedChangeProp,
  ...props
}: SwitchProps) {
  const [checkedState, setCheckedState] = React.useState(Boolean(checkedProp));

  const isControlled = checkedProp !== undefined;
  const checked = !isControlled ? checkedState : checkedProp;

  const onCheckedChange = (isChecked: boolean) => {
    if (isControlled) {
      onCheckedChangeProp?.(isChecked);
    } else {
      setCheckedState(isChecked);
    }
  };

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "shadow-xs hover:border-primary focus-visible:border-ring focus-visible:ring-ring/50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-input/80 group peer inline-flex h-6 w-10 shrink-0 items-center rounded-full border border-transparent outline-none transition-all focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      checked={checked}
      onCheckedChange={onCheckedChange}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-background dark:data-[state=checked]:bg-primary-foreground dark:data-[state=unchecked]:bg-foreground ease-in-out-material transition-transform! pointer-events-none flex size-5 items-center justify-center rounded-full ring-0 duration-300 data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0",
          thumbClassName,
        )}
      >
        <div className="group-data-[state=unchecked]:hidden">{iconChecked}</div>
        <div className="group-data-[state=checked]:hidden">{iconUnchecked}</div>
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );
}

export { Switch };
