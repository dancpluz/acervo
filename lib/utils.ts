import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { FactoryT, PersonT, RepresentativeT } from '@/lib/types';
import { FieldT, TableFieldT, EnumFieldT } from '@/lib/fields';
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function setFormValues(form: UseFormReturn, data: any) {
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
      setFormValues(form, value)
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
    return data.map((factory: FactoryT) => {
      const person = factory.person as PersonT;
      return {
        name: person.info.fantasy_name ? person.info.fantasy_name : person.info.name,
        pricing: factory.pricing,
        style: factory.style,
        ambient: factory.ambient,
        representative: factory.representative,
        discount: factory.discount,
        direct_sale: factory.direct_sale,
        link_table: factory.link_table,
        link_catalog: factory.link_catalog,
        link_site: factory.link_site
      }
    })
  } catch (error) {
    console.log(error);
    return [];
  }
}

export function formatRepresentative(data: RepresentativeT[]): any {
  try {
    return data.map((representative: RepresentativeT) => {
      const person = representative.person as PersonT;
      return {
        name: person.info.fantasy_name ? person.info.fantasy_name : person.info.name,
        info_email: person.info.info_email,
        phone: person.contact,
        telephone: person.contact,
        factories: representative.refs?.representative,
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

type Fields = { [key: string]: EnumFieldT } | { [key: string]: FieldT } | TableFieldT[]

export const createDefaultValues = (fields: Fields) => Object.values(fields).map((field) => { return field.value }).reduce((acc, key) => ({ ...acc, [key]: '' }), {});

export const formatVerifications = (fields: Fields) => Object.assign({}, ...Object.values(fields).map((e) => {
  const obj: { [key: string]: z.ZodType<any, any> } = {};
  obj[e.value] = e.validation;
  return obj;
}));