import { z } from "zod";
import cidades from '@/lib/cidades.json';
import bancos from '@/lib/bancos.json';
import { PricingEnum, StyleEnum, AmbientEnum, TaxEnum } from "./types";

export type FieldT = {
  value: string;
  label: string;
  placeholder: string;
  validation: z.ZodType<any, any>;
  mask?: (string | RegExp)[];
};

export type EnumFieldT = {
  value: string;
  label: string;
  validation: z.ZodType<any, any>;
  placeholder?: string;
  items: { value: string, label: string }[];
};

export type TableFieldT = {
  value: string;
  label: string;
  validation: z.ZodType<any, any>;
  placeholder?: string;
  mask?: (string | RegExp)[];
  size?: string;
};

export const fieldItems: { [key: string] : { value: string, label: string }[] } = {
  state: Object.keys(cidades).map((e) => ({ label: e, value: e })),
  bank: bancos.map((e) => ({ label: e, value: e })),
  tax_payer: [
    { label: 'Não Informado', value: 'unknown' },
    { label: 'Contribuinte isento de inscrição no cadastro de contribuintes do ICMS', value: 'yes' },
    { label: 'Não Contribuinte, que pode ou não possuir inscrição estadual no cadastro ICMS', value: 'no' },
  ],
  pricing: [
    { label: '$', value: '1' },
    { label: '$$', value: '2' },
    { label: '$$$', value: '3' },
    { label: '$$$$', value: '4' },
    { label: '$$$$$', value: '5' }
  ],
  style: [
    { label: 'Contemporâneo', value: 'Contemporâneo' },
    { label: 'Clássico', value: 'Clássico' },
    { label: 'Rústico', value: 'Rústico' },
    { label: 'Moderno', value: 'Moderno' }
  ],
  ambient: [
    { label: 'Interno', value: 'internal' },
    { label: 'Externo', value: 'external' },
    { label: 'Int. e Externo', value: 'both' }
  ],
} as const;

export const fields: { [key: string]: FieldT } = {
  company_name: {
    value: 'company_name',
    label: 'NOME OU RAZÃO SOCIAL*',
    placeholder: 'Ex. ACERVO MOBILIA COMERCIO VAREJISTA DE MOVEIS LTDA',
    validation: z.string().min(1, 'Campo não preenchido.').max(150, 'Máximo de 150 caracteres.'),
  },
  fantasy_name: {
    value: 'fantasy_name',
    label: 'NOME FANTASIA',
    placeholder: 'Ex. Acervo Mobilia',
    validation: z.string().max(150, 'Máximo de 150 caracteres.').optional().or(z.literal('')),
  },
  name: {
    value: 'name',
    label: 'NOME*',
    placeholder: 'Ex. Thiago',
    validation: z.string().min(1, 'Campo não preenchido.').max(150, 'Máximo de 150 caracteres.'),
  },
  surname: {
    value: 'surname',
    label: 'SOBRENOME*',
    placeholder: 'Ex. Turchi',
    validation: z.string().min(1, 'Campo não preenchido.').max(150, 'Máximo de 150 caracteres.'),
  },
  info_email: {
    value: 'info_email',
    label: 'E-MAIL*',
    placeholder: 'Ex. acervomobilia@gmail.com',
    validation: z.string().min(1, 'Campo não preenchido.').email('E-mail inválido.')
  },
  cpf: {
    value: 'cpf',
    label: 'CPF',
    placeholder: 'Ex. 000.000.000-00',
    validation: z.string().refine((e: string) => e.replace(/\D/g, "").length == 11, 'O CPF deve ter 11 números.').or(z.literal('')),
    mask: [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/],
  },
  rg: {
    value: 'rg',
    label: 'RG',
    placeholder: 'Ex. 0.000.000',
    validation: z.string().refine((e: string) => e.replace(/\D/g, "").length == 7, 'O RG deve ter 7 números.').or(z.literal('')),
    mask: [/\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/],
  },
  cnpj: {
    value: 'cnpj',
    label: 'CNPJ*',
    placeholder: 'Ex. 00.000.000/0000-00',
    validation: z.string().refine((e: string) => e.replace(/\D/g, "").length == 14, 'O CNPJ deve ter 14 números.'),
    mask: [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/],
  },
  state_register: {
    value: 'state_register',
    label: 'INSCRIÇÃO ESTADUAL',
    placeholder: 'Ex. 149.679.601.869',
    validation: z.string().refine((e: string) => e.replace(/\D/g, "").length == 12, 'A inscrição estadual deve ter 12 números.').or(z.literal('')),
    mask: [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/],
  },
  municipal_register: {
    value: 'municipal_register',
    label: 'INSCRIÇÃO MUNICIPAL',
    placeholder: 'Ex. 149.679.601.869',
    validation: z.string().refine((e: string) => e.replace(/\D/g, "").length == 12, 'A inscrição municipal deve ter 12 números.').or(z.literal('')),
    mask: [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/],
  },
  pix: {
    value: 'pix',
    label: 'CHAVE PIX',
    placeholder: 'Ex. 6198765432',
    validation: z.string().max(150, 'Máximo de 150 caracteres.').optional().or(z.literal('')),
  },
  account: {
    value: 'account',
    label: 'CONTA',
    placeholder: 'Ex. 1751610-8',
    validation: z.string().refine((e: string) => e.replace(/\D/g, "").length == 8, 'A conta deve ter 8 números.').or(z.literal('')),
    mask: [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/],
  },
  agency: {
    value: 'agency',
    label: 'AGÊNCIA',
    placeholder: 'Ex. 1659',
    validation: z.string().max(10, 'Máximo de 10 caracteres.').optional().or(z.literal('')),
  },
  cep: {
    value: 'cep',
    label: 'CEP',
    placeholder: 'Ex. 71234-567',
    mask: [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/],
    validation: z.string().refine((e: string) => e.replace(/\D/g, "").length == 8, 'O CEP deve ter 8 números.').or(z.literal('')),
  },
  address: {
    value: 'address',
    label: 'ENDEREÇO',
    placeholder: 'Ex. Quadra F Dois',
    validation: z.string().max(50, 'Máximo de 50 caracteres.').optional().or(z.literal('')),
  },
  number: {
    value: 'number',
    label: 'NÚMERO',
    placeholder: 'Ex. 123',
    validation: z.string().max(50, 'Máximo de 50 caracteres.').optional().or(z.literal('')),
  },
  complement: {
    value: 'complement',
    label: 'COMPLEMENTO',
    placeholder: 'Ex. Jardim Santos Dumont I',
    validation: z.string().max(50, 'Máximo de 50 caracteres.').optional().or(z.literal('')),
  },
  representative: {
    value: 'representative',
    label: 'REPRESENTAÇÃO VINCULADA',
    placeholder: 'Selecione uma Representação',
    validation: z.string().optional().or(z.literal('')),
  },
  discount: {
    value: 'discount',
    label: 'DESCONTO',
    placeholder: 'Ex. 5',
    validation: z.string().transform((val) => Number((Number(`${val}`.replace(",", ".")) / 100).toFixed(4))).pipe(z.number({ invalid_type_error: 'Somente números.' }).gt(0, 'O desconto deve ser maior que 0').lte(1, 'O desconto não pode ser maior que 100%.')).optional().or(z.literal('')),
  },
  direct_sale: {
    value: 'direct_sale',
    label: 'VENDA DIRETA',
    placeholder: 'Ex. 3',
    validation: z.string().transform((val) => Number((Number(`${val}`.replace(",", ".")) / 100).toFixed(4))).pipe(z.number({ invalid_type_error: 'Somente números.' }).gt(0, 'O desconto deve ser maior que 0').lte(1, 'O desconto não pode ser maior que 100%.')).optional().or(z.literal('')),
  },
  observations: {
    value: 'observations',
    label: 'OBSERVAÇÕES',
    placeholder: 'Detalhes, anotações e comentários',
    validation: z.string().optional().or(z.literal('')),
  },
  link_catalog: {
    value: 'link_catalog',
    label: 'LINK CATÁLOGO DE ACABAMENTO',
    placeholder: 'Ex. https://exemplo.com.br',
    validation: z.string().url({ message: 'Link inválida' }).optional().or(z.literal('')),
  },
  link_table: {
    value: 'link_table',
    label: 'LINK TABELA',
    placeholder: 'Ex. https://exemplo.com.br',
    validation: z.string().url({ message: 'Link inválida' }).optional().or(z.literal('')),
  },
  link_site: {
    value: 'link_site',
    label: 'LINK SITE',
    placeholder: 'Ex. https://exemplo.com.br',
    validation: z.string().url({ message: 'Link inválida' }).optional().or(z.literal('')),
  },
  office: {
    value: 'office',
    label: 'ESCRITÓRIO VINCULADO',
    placeholder: 'Selecione um escritório',
    validation: z.string().optional().or(z.literal('')),
  },
  role: {
    value: 'role',
    label: 'CARGO*',
    placeholder: 'Ex. Estagiário',
    validation: z.string().min(1, 'Campo não preenchido.').max(150, 'Máximo de 150 caracteres.'),
  },
  service: {
    value: 'service',
    label: 'SERVIÇO*',
    placeholder: 'Ex. Mecânico',
    validation: z.string().min(1, 'Campo não preenchido.').max(150, 'Máximo de 150 caracteres.'),
  },
};


export const enumFields: { [key: string]: EnumFieldT } = {
  tax_payer: {
    value: 'tax_payer',
    label: 'CONTRIBUINTE*',
    placeholder: 'Selecione contribuinte',
    // @ts-ignore
    validation: z.enum(fieldItems.tax_payer.map(item => item.value), { message: 'Campo não preenchido.' }), 
    items: fieldItems.tax_payer,
  },
  bank: {
    value: 'bank',
    label: 'BANCO',
    placeholder: 'Selecione um banco',
    // @ts-ignore
    validation: z.enum([...fieldItems.bank.map(item => item.value), '']),
    items: fieldItems.bank,
  },
  state: {
    value: 'state',
    label: 'ESTADO',
    placeholder: 'Selecione estado',
    // @ts-ignore
    validation: z.enum([...fieldItems.state.map(item => item.value), '']),
    items: fieldItems.state,
  },
  city: {
    value: 'city',
    label: 'CIDADE',
    placeholder: 'Selecione cidade',
    validation: z.string().optional().or(z.literal('')),
    items: [],
  },
  pricing: {
    value: 'pricing',
    label: 'PADRÃO*',
    // @ts-ignore
    validation: z.enum(fieldItems.pricing.map(item => item.value), { message: 'Selecione um padrão.' }),
    items: fieldItems.pricing,
  },
  style: {
    value: 'style',
    label: 'ESTILO',
    // @ts-ignore
    validation: z.enum([...fieldItems.style.map(item => item.value), '']),
    items: fieldItems.style,
  },
  ambient: {
    value: 'ambient',
    label: 'AMBIENTE*',
    // @ts-ignore
    validation: z.enum(fieldItems.ambient.map(item => item.value), { message: 'Selecione um ambiente.' }),
    items: fieldItems.ambient,
  },
};

export const contactFields: TableFieldT[] = [
  {
    value: 'name',
    label: 'NOME*',
    validation: z.string().min(1, 'Campo não preenchido.'),
  },
  {
    value: 'detail',
    label: 'DETALHE',
    validation: z.string().optional().or(z.literal('')),
  },
  {
    value: 'phone',
    label: 'CELULAR*',
    validation: z.string().min(1, 'Campo não preenchido.').refine((e: string) => e.replace(/\D/g, "").length == 10 || e.replace(/\D/g, "").length == 11, 'O celular deve ter 10-11 números.'),
    mask: ['(', /\d/, /\d/, ')', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
  },
  {
    value: 'telephone',
    label: 'TELEFONE',
    validation: z.string().refine((e: string) => e.replace(/\D/g, "").length == 10, 'O telefone deve ter 10-11 números.').optional().or(z.literal('')),
    mask: ['(', /\d/, /\d/, ')', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
  }
];

export const teamFields: TableFieldT[] = [
  {
    value: 'name',
    label: 'NOME*',
    validation: z.string().min(1, 'Campo não preenchido.'),
  },
  {
    value: 'telephone',
    label: 'TELEFONE',
    validation: z.string().refine((e: string) => e.replace(/\D/g, "").length == 10, 'O telefone deve ter 10-11 números.').optional().or(z.literal('')),
    mask: ['(', /\d/, /\d/, ')', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
  },
  {
    value: 'phone',
    label: 'CELULAR',
    validation: z.string().refine((e: string) => e.replace(/\D/g, "").length == 10 || e.replace(/\D/g, "").length == 11, 'O celular deve ter 10-11 números.').optional().or(z.literal('')),
    mask: ['(', /\d/, /\d/, ')', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
  },
  {
    value: 'email',
    label: 'EMAIL',
    placeholder: 'Ex. acervo@gmail.com',
    validation: z.string().email('E-mail inválido.').optional().or(z.literal('')),
  },
  {
    value: 'role',
    label: 'CARGO*',
    placeholder: 'Ex. Estagiário',
    validation: z.string().min(1, 'Campo não preenchido.'),
  },
  {
    value: 'detail',
    label: 'DETALHE',
    validation: z.string().optional().or(z.literal('')),
  },
];

export const markupFields: TableFieldT[] = [
  {
    value: 'ref',
    label: '',
    validation: z.string().optional().or(z.literal('')),
  },
  {
    value: 'name',
    label: 'NOME',
    size: '250px',
    placeholder: 'Ex. Pessoa Física',
    validation: z.string().min(1, 'Campo não preenchido.'),
  },
  {
    value: 'observation',
    label: 'OBSERVAÇÃO',
    size: '450px',
    placeholder: 'Anotações, detalhes, informações',
    validation: z.string().optional().or(z.literal('')),
  },
  {
    value: '12x',
    label: '12X',
    size: '50px',
    placeholder: 'Ex. 1,20',
    validation: z.string().transform((val) => Number((Number(`${val}`.replace(",", ".")) / 100).toFixed(4))).pipe(z.number({ invalid_type_error: 'Somente números.' }).gt(0, 'O desconto deve ser maior que 0').lte(1, 'O desconto não pode ser maior que 100%.')),
  },
  {
    value: '6x',
    label: '6X',
    size: '50px',
    placeholder: 'Ex. 2',
    validation: z.string().transform((val) => Number((Number(`${val}`.replace(",", ".")) / 100).toFixed(4))).pipe(z.number({ invalid_type_error: 'Somente números.' }).gt(0, 'O desconto deve ser maior que 0').lte(1, 'O desconto não pode ser maior que 100%.')),
  },
  {
    value: 'cash',
    label: 'À VISTA',
    size: '50px',
    placeholder: 'Ex. 0,35',
    validation: z.string().transform((val) => Number((Number(`${val}`.replace(",", ".")) / 100).toFixed(4))).pipe(z.number({ invalid_type_error: 'Somente números.' }).gt(0, 'O desconto deve ser maior que 0').lte(1, 'O desconto não pode ser maior que 100%.')),
  }
];

export const freightFields: { [key: string]: TableFieldT } = {
  ref: {
    value: 'ref',
    label: '',
    validation: z.string().optional().or(z.literal('')),
  },
  region: {
    value: 'region',
    label: '',
    placeholder: '',
    validation: z.string().min(1, 'Campo não preenchido.'),
  },
  fee: {
    value: 'fee',
    label: '',
    placeholder: '',
    validation: z.string().transform((val) => Number((Number(`${val}`.replace(",", ".")) / 100).toFixed(4))).pipe(z.number({ invalid_type_error: 'Somente números.' }).gt(0, 'O taxa deve ser maior que 0, se quiser Grátis, apague').lte(1, 'O desconto não pode ser maior que 100%.')).or(z.literal('')),
  },
};


export const orderFields: { [key: string]: FieldT | EnumFieldT } = {
  id_order: {
    value: 'id_order',
    label: 'ID*',
    placeholder: 'Ex. 12345678',
    validation: z.string().min(1, 'Campo não preenchido.'),
  },
  date: {
    value: 'date',
    label: 'DATA*',
    placeholder: 'Ex. 21/05/2024',
    mask: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/],
    validation: z.string().refine((e: string) => e.replace(/\D/g, "").length == 8, 'A data deve ter 8 números.'),
  },
  cep: fields.cep,
  address: fields.address,
  number: fields.number,
  state: enumFields.state,
  city: enumFields.city,
  complement: fields.complement
};

const addressFields = {
  cep: fields.cep,
  address: fields.address,
  number: fields.number,
  state: enumFields.state,
  city: enumFields.city,
  complement: fields.complement
}

const paymentFields = {
  account: fields.account,
  agency: fields.agency,
  bank: enumFields.bank,
  pix: fields.pix
}

const fisicalPerson = {
  contact: contactFields,
  payment: paymentFields,
  info: {
    name: fields.name,
    surname: fields.surname,
    cpf: fields.cpf,
    rg: fields.rg,
    tax_address: addressFields,
    info_email: fields.info_email,
  },
  observations: fields.observations,
}

const juridicalPerson = {
  contact: contactFields,
  payment: paymentFields,
  info: {
    company_name: fields.company_name,
    fantasy_name: fields.fantasy_name,
    cnpj: fields.cnpj,
    tax_address: addressFields,
    info_email: fields.info_email,
    tax_payer: enumFields.tax_payer,
    municipal_register: fields.municipal_register,
    state_register: fields.state_register,
  },
  observations: fields.observations,
}

export const collaboratorFields = {
  person: fisicalPerson,
  role: fields.role,
}

export const clientFisicalFields = {
  person: { ...fisicalPerson, info: { ...fisicalPerson.info, shipping_address: addressFields }  },
  order: orderFields,
  office: fields.office,
}

export const clientJuridicalFields = {
  person: { ...juridicalPerson, info: { ...juridicalPerson.info, shipping_address: addressFields } },
  order: orderFields,
  office: fields.office,
}

export const serviceFisicalFields = {
  person: fisicalPerson,
  service: fields.service,
}

export const serviceJuridicalFields = {
  person: juridicalPerson,
  service: fields.service,
}

export const representativeFields = {
  person: juridicalPerson,
  service: teamFields,
}

export const officeFields = {
  person: juridicalPerson,
  service: teamFields,
}

export const factoryFields = {
  person: juridicalPerson,
  representative: fields.representative,
  pricing: enumFields.pricing,
  ambient: enumFields.ambient,
  style: enumFields.style,
  direct_sale: fields.direct_sale,
  discount: fields.discount,
  link_table: fields.link_table,
  link_catalog: fields.link_catalog,
  link_site: fields.link_site,
}

type CollaboratorFieldsT = typeof collaboratorFields;
type ClientFisicalFieldsT = typeof clientFisicalFields;
type ClientJuridicalFieldsT = typeof clientJuridicalFields;
type ServiceFisicalFieldsT = typeof serviceFisicalFields;
type ServiceJuridicalFieldsT = typeof serviceJuridicalFields;
type RepresentativeFieldsT = typeof representativeFields;
type OfficeFieldsT = typeof officeFields;
type FactoryFieldsT = typeof factoryFields;

export type AllFieldTypes =
  | CollaboratorFieldsT
  | ClientFisicalFieldsT
  | ClientJuridicalFieldsT
  | ServiceFisicalFieldsT
  | ServiceJuridicalFieldsT
  | RepresentativeFieldsT
  | OfficeFieldsT
  | FactoryFieldsT;