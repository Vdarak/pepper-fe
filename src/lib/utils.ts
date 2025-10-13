import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { v4 as uuidv4 } from 'uuid';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate a new UUID v4
 */
export function generateUUID(): string {
  return uuidv4();
}
