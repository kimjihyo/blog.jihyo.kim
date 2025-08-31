"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { motion } from "motion/react";

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
        "group peer inline-flex h-6 w-10 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none hover:border-primary focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:justify-end data-[state=checked]:bg-primary data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-input/80",
        className,
      )}
      checked={checked}
      onCheckedChange={onCheckedChange}
      {...props}
    >
      <motion.div layout>
        <SwitchPrimitive.Thumb
          data-slot="switch-thumb"
          className={cn(
            "pointer-events-none flex size-5 items-center justify-center rounded-full bg-background ring-0 dark:data-[state=checked]:bg-primary-foreground dark:data-[state=unchecked]:bg-foreground",
            thumbClassName,
          )}
        >
          <div className="group-data-[state=unchecked]:hidden">
            {iconChecked}
          </div>
          <div className="group-data-[state=checked]:hidden">
            {iconUnchecked}
          </div>
        </SwitchPrimitive.Thumb>
      </motion.div>
    </SwitchPrimitive.Root>
  );
}

export { Switch };
