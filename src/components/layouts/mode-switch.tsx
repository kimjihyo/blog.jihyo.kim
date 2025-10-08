"use client";

import React from "react";
import { MoonIcon, SunIcon } from "lucide-react";

import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";

export function ModeSwitch() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Switch
      aria-label="Toggle theme"
      checked={theme === "light"}
      onCheckedChange={(checked) => {
        setTheme(checked ? "light" : "dark");
      }}
      iconChecked={<SunIcon className="size-3 text-foreground" />}
      iconUnchecked={<MoonIcon className="size-3 text-foreground" />}
      className="data-[state=checked]:bg-input"
      thumbClassName="data-[state=unchecked]:bg-card!"
    />
  );
}
