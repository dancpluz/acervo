import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { FactoryT, PersonT } from '@/lib/types';

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

export function formatFactory(data: FactoryT[]): any {
  try {
    return data.map((e: FactoryT) => {
      const person = e.person as PersonT; // Cast 'person' to type 'PersonT'
      return {
        name: person.info.fantasy_name ? person.info.fantasy_name : person.info.name,
        pricing: e.pricing,
        style: e.style,
        ambient: e.ambient,
        representative: e.representative,
        discount: e.discount,
        direct_sale: e.direct_sale,
        link_table: e.link_table,
        link_catalog: e.link_catalog,
        link_site: e.link_site
      }
    })
  } catch (error) {
    console.log(error);
    return [];
  }
}