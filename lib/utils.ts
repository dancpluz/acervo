import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getEnumItems(enumObject: { [key: string]: string | number }): string[] | number[] {
  const values = Object.values(enumObject) as string[] | number[];
  // Bem tosco, mas funciona
  return typeof values[values.length-1] === 'number' ? values.slice(values.length / 2) : values;
}

export function formatPercent(float?: number) {
  if (!float) return "-";

  const decimals: number = float.toString().split(".")[1]?.length || 0;
  const minimumFractionDigits: number = decimals >= 3 ? 2 : 0;
  const formated = float.toLocaleString('pt-BR', { style: 'percent', minimumFractionDigits });
  
  return formated;
}