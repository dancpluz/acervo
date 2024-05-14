import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { FactoryT, PersonT } from '@/lib/types';
import { UseFieldArrayReturn, UseFormReturn } from "react-hook-form";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function setFormValues(form: UseFormReturn, tableForm: UseFieldArrayReturn<any,any,any>, data: any) {
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
      setFormValues(form, tableForm, value)
    } else if (value !== '') {
      form.setValue(key, value)
    }
  }
}

export function formatPercent(float: number | '') {
  if (float === '') return "-";

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

export async function fillCepFields(inputCep: string, form: any) {
  try {
    const cep = inputCep.replace(/\D/g, '');
    if (cep.length === 8) {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`,{
        method: 'GET',
      });
      
      const cepInfo = await res.json();

      if (cepInfo.erro) {
        // form.resetField('address')
        // form.resetField('state')
        // form.resetField('city')
        // form.resetField('complement')
      } else {
        const { logradouro, complemento, bairro, localidade, uf } = cepInfo;
        
        form.setValue('address', logradouro + ' ' + bairro, { shouldValidate: true });
        form.setValue('state', uf, { shouldValidate: true });
        form.setValue('city', localidade, { shouldValidate: true });
        form.setValue('complement', complemento, { shouldValidate: true });
      }
    }
  } catch(error) {
    console.log(error);
  }
}