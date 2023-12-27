import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import {Role} from "../db/schema";
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function hasMinimumRole(userRole: Role, requiredRole: Role) {
  switch (userRole) {
    case 'admin':
      return true;
    case 'styre':
      return requiredRole !== 'admin';
    case 'medlem':
      return requiredRole === 'medlem';
  }
}