import { clsx, type ClassValue } from "clsx"

import { toast } from "@/hooks/use-toast"
import { UseFormSetError } from "react-hook-form"

import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const normalizePath = (path: string) => {
  return path.startsWith('/') ? path.slice(1) : path;
}
