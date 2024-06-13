import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import * as Types from '@/lib/types';
import { FieldT, TableFieldT, EnumFieldT } from '@/lib/fields';
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function setFormValues(form: UseFormReturn, data: any) {
  for (const [key, value] of Object.entries(data)) {
    // MUITO TOSCO, MUDE DPS
    if (key === 'representative') {
      form.setValue(key, value)
    }
    else if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
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

export function formatFactory(data: Types.FactoryT[]): any {
  try {
    return data.map((factory: Types.FactoryT) => {
      const person = factory.person as Types.PersonT;
      return {
        company_name: person.info.fantasy_name ? person.info.fantasy_name : person.info.company_name,
        pricing: factory.pricing,
        style: factory.style,
        ambient: factory.ambient,
        representative: factory.representative.label,
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

export function formatRepresentative(data: Types.RepresentativeT[]): any {
  try {
    return data.map((representative: Types.RepresentativeT) => {
      const person = representative.person as Types.PersonT;
      return {
        company_name: person.info.fantasy_name ? person.info.fantasy_name : person.info.company_name,
        info_email: person.info.info_email,
        phone: person.contact[0] ? person.contact[0].phone : '-',
        telephone: person.contact[0] ? person.contact[0].telephone : '-',
        factories: representative.refs?.representative,
      }
    })
  } catch (error) {
    console.log(error);
    return [];
  }
}

export function formatOffice(data: Types.OfficeT[]): any {
  try {
    return data.map((office: Types.OfficeT) => {
      const person = office.person as Types.PersonT;
      return {
        company_name: person.info.fantasy_name ? person.info.fantasy_name : person.info.company_name,
        info_email: person.info.info_email,
        phone: person.contact[0] ? person.contact[0].phone : '-',
        telephone: person.contact[0] ? person.contact[0].telephone : '-',
      }
    })
  } catch (error) {
    console.log(error);
    return [];
  }
}

export function formatClient(data: Types.ClientT[]): any {
  try {
    return data.map((client: Types.ClientT) => {
      const person = client.person as Types.PersonT;
      return {
        name: person.info.fantasy_name ? person.info.fantasy_name : person.info.company_name ? person.info.company_name : person.info.name + ' ' + person.info.surname,
        info_email: person.info.info_email,
        phone: person.contact[0] ? person.contact[0].phone : '-',
        telephone: person.contact[0] ? person.contact[0].telephone : '-',
        //office
      }
    })
  } catch (error) {
    console.log(error);
    return [];
  }
}

export function formatCollaborator(data: Types.CollaboratorT[]): any {
  try {
    return data.map((collaborator: Types.CollaboratorT) => {
      const person = collaborator.person as Types.PersonT;
      return {
        name: person.info.name + ' ' + person.info.surname,
        role: collaborator.role,
        info_email: person.info.info_email,
        phone: person.contact[0] ? person.contact[0].phone : '-',
        telephone: person.contact[0] ? person.contact[0].telephone : '-',
        pix: person.payment.pix
      }
    })
  } catch (error) {
    console.log(error);
    return [];
  }
}

export function formatService(data: Types.ServiceT[]): any {
  try {
    return data.map((service: Types.ServiceT) => {
      const person = service.person as Types.PersonT;
      return {
        service: service.service,
        name: person.info.fantasy_name ? person.info.fantasy_name : person.info.company_name ? person.info.company_name : person.info.name + ' ' + person.info.surname,
        info_email: person.info.info_email,
        phone: person.contact[0] ? person.contact[0].phone : '-',
        telephone: person.contact[0] ? person.contact[0].telephone : '-',
        pix: person.payment.pix,
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

export const formatVerifications = (fields: Fields, filter?: string[]) => Object.assign({}, ...Object.values(fields).filter((e) => filter ? !filter.includes(e.value) : true).map((e) => {
  const obj: { [key: string]: z.ZodType<any, any> } = {};
  obj[e.value] = e.validation;
  return obj;
}));