import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {},
) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "Asia/Seoul",
    ...options,
  }).format(new Date(date));
}
