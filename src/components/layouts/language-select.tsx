"use client";

import { VariantProps } from "class-variance-authority";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button, buttonVariants } from "../ui/button";
import { Icons } from "../icons";
import { CaretDownIcon } from "@radix-ui/react-icons";

export function LanguageSelect({
  variant = "ghost",
  size = "default",
}: VariantProps<typeof buttonVariants>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className="gap-1">
          <Icons.translate />
          <CaretDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>한국어</DropdownMenuItem>
        <DropdownMenuItem>English</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
