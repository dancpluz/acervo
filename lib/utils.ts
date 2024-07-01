import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as Types from '@/lib/types';
import { FieldT, TableFieldT, AllFieldTypes, EnumFieldT } from '@/lib/fields';
import { z } from "zod";

export const translationFields: { [key: string]: string } = {
  company_name: 'Nome/Razão Social',
  fantasy_name: 'Nome Fantasia',
  name: 'Nome',
  info_email: 'Email',
  cpf: 'CPF',
  rg: 'RG',
  cnpj: 'CNPJ',
}

export type EntityTitleT = {
  plural: string,
  singular: string,
  sufix: string
};

export const entityTitles: { [key: string]: EntityTitleT } = {
  representative: {
    plural: 'representações',
    singular: 'representação',
    sufix: 'a'
  },
  client: {
    plural: 'clientes',
    singular: 'cliente',
    sufix: 'o'
  },
  service: {
    plural: 'serviços',
    singular: 'serviço',
    sufix: 'o'
  },
  office: {
    plural: 'escritórios',
    singular: 'escritório',
    sufix: 'o'
  },
  factory: {
    plural: 'fábricas',
    singular: 'fábrica',
    sufix: 'a'
  },
  collaborator: {
    plural: 'colaboradores',
    singular: 'colaborador',
    sufix: 'o'
  },
  markup: {
    plural: 'marcações',
    singular: 'marcação',
    sufix: 'a'
  },
  freight: {
    plural: 'fretes',
    singular: 'frete',
    sufix: 'o'
  }
}


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPercent(float: number | '') {
  if (float === '') return "-";

  const decimals: number = float.toString().split(".")[1]?.length || 0;
  const minimumFractionDigits: number = decimals >= 3 ? 2 : 0;
  const formated = float.toLocaleString('pt-BR', { style: 'percent', minimumFractionDigits });

  return formated;
}

export function formatRefEntity(entity: string, person: any) {
  switch (entity) {
    case 'representative':
      return {
        ref: person.ref,
        label: person.info.fantasy_name ? person.info.company_name + ' - ' + person.info.fantasy_name : person.info.company_name,
        info_email: person.info.info_email,
        contact: person.contact,
      }
    case 'office':
      return {
        ref: person.ref,
        label: person.info.fantasy_name ? person.info.company_name + ' - ' + person.info.fantasy_name : person.info.company_name,
        info_email: person.info.info_email,
        contact: person.contact,
      }
    default:
      return {}
  }
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
        representative: factory.representative?.label,
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
        office: client.office?.label,
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

export async function fillCepFields(inputCep: string, form: any, path: string) {
  try {
    const cep = inputCep.replace(/\D/g, '');
    if (cep.length === 8) {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`,{
        method: 'GET',
      });
      
      const cepInfo = await res.json();

      if (cepInfo.erro) {
        form.resetField(path + 'address')
        form.resetField(path + 'state')
        form.resetField(path + 'city')
        form.resetField(path + 'complement')
      } else {
        const { logradouro, complemento, bairro, localidade, uf } = cepInfo;
        
        form.setValue(path + 'address', logradouro + ' ' + bairro, { shouldValidate: true });
        form.setValue(path + 'state', uf, { shouldValidate: true });
        form.setValue(path + 'city', localidade, { shouldValidate: true });
        form.setValue(path + 'complement', complemento, { shouldValidate: true });
      }
    }
  } catch(error) {
    console.log(error);
  }
}

export function createDefaultArray(fields: TableFieldT[] | { [key: string]: FieldT | EnumFieldT }): { [key: string] : '' | [] } {
  return Object.values(fields).map((field) => { return field.value }).reduce((acc, key) => ({ ...acc, [key]: '' }), {});
}

// Retorna os valores vazios e as verificações de cada campo

export function formatFields(fields: AllFieldTypes | { [key: string]: TableFieldT; }) : [any, z.ZodObject<any, any>]{
  let defaultValues: { [key: string]: '' | [] } = {};
  let validationValues: { [key: string]: z.ZodType<any, any> } = {};

  for (const [key, value] of Object.entries(fields)) {
    if (value['value']) {
      defaultValues[key] = '';
      validationValues[key] = value.validation;
    } else if (key === 'order' || Array.isArray(value)) {
      // Se for vetor ou pedidos, tem que fazer um objeto com todos os campos
      defaultValues[key] = [];
      validationValues[key] = z.array(z.object(Object.values(value).reduce((acc: { [key: string]: z.ZodType<any, any> }, { value, validation }: any) => { acc[value] = validation; return acc; }, {}))).optional()
    } else {
      [defaultValues[key], validationValues[key]] = formatFields(value);
    }
  }

  return [defaultValues, z.object(validationValues)];
}

export function calculateTextWidth(size: number, text: string ) {
  let font = `${size}px verdana`;

  let canvas = document.createElement('canvas');
  let context = canvas.getContext("2d");
  if (context !== null) {
    context.font = font;
    let width = context.measureText(text).width + 2;
    let formattedWidth = Math.ceil(width) + "px";

    return formattedWidth;
  } else {
    return "";
  }
}