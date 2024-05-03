import { z } from "zod";
import cidades from '@/lib/cidades.json';
import { PricingEnum, StyleEnum, AmbientEnum, TaxEnum } from "./types";

export type FieldT = {
  value: string;
  label: string;
  placeholder: string;
  validation: z.ZodType<any, any>;
  mask?: (string | RegExp)[];
  items?: string[] | { [key: string]: string[] };
};

export type EnumFieldT = {
  value: string;
  label: string;
  validation: z.ZodType<any, any>;
  items: string[] | number[]
};

export type TableFieldT = {
  value: string;
  label: string;
  validation: z.ZodType<any, any>;
  mask?: (string | RegExp)[];
};

export const fields: { [key: string]: FieldT } = {
  name: {
    value: 'name',
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
  info_email: {
    value: 'info_email',
    label: 'E-MAIL*',
    placeholder: 'Ex. acervomobilia@gmail.com',
    validation: z.string().min(1, 'Campo não preenchido.').email('E-mail inválido.')
  },
  cnpj: {
    value: 'cnpj',
    label: 'CNPJ*',
    placeholder: 'Ex. 00.000.000/0000-00',
    validation: z.string().refine((e: string) => e.replace(/\D/g, "").length == 14, 'O CNPJ deve ter 14 números.'),
    mask: [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/],
  },
  tax_payer: {
    value: 'tax_payer',
    label: 'CONTRIBUINTE*',
    placeholder: 'Selecione contribuinte',
    validation: z.nativeEnum(TaxEnum, { required_error: 'Campo não preenchido.' }),
    items: Object.values(TaxEnum),
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
  bank: {
    value: 'bank',
    label: 'BANCO',
    placeholder: 'Ex. Santander',
    validation: z.string().max(50, 'Máximo de 50 caracteres.').optional().or(z.literal('')),
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
  state: {
    value: 'state',
    label: 'ESTADO',
    placeholder: 'Selecione estado',
    validation: z.string().optional().or(z.literal('')),
    items: Object.keys(cidades),
  },
  city: {
    value: 'city',
    label: 'CIDADE',
    placeholder: 'Selecione cidade',
    validation: z.string().optional().or(z.literal('')),
    items: cidades,
  },
  complement: {
    value: 'complement',
    label: 'COMPLEMENTO',
    placeholder: 'Ex. Jardim Santos Dumont I',
    validation: z.string().max(50, 'Máximo de 50 caracteres.').optional().or(z.literal('')),
  },
  representative: {
    value: 'representative',
    label: 'NOME DA REPRESENTAÇÃO',
    placeholder: 'Selecione uma Representação',
    validation: z.string().optional().or(z.literal('')),
    items: []
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
  }
};

export const enumFields: { [key: string]: EnumFieldT } = {
  pricing: {
    value: 'pricing',
    label: 'PADRÃO*',
    validation: z.nativeEnum(PricingEnum, { required_error: 'Campo não preenchido.' }),
    items: Object.values(PricingEnum),
  },
  style: {
    value: 'style',
    label: 'ESTILO*',
    validation: z.nativeEnum(StyleEnum, { required_error: 'Campo não preenchido.' }),
    items: Object.values(StyleEnum),
  },
  ambient: {
    value: 'ambient',
    label: 'AMBIENTE*',
    validation: z.nativeEnum(AmbientEnum, { required_error: 'Campo não preenchido.' }),
    items: Object.values(AmbientEnum),
  },
};

export const tableFields: TableFieldT[] = [
  {
    value: 'name',
    label: 'NOME',
    validation: z.string().optional().or(z.literal('')),
  },
  {
    value: 'detail',
    label: 'DETALHE',
    validation: z.string().optional().or(z.literal('')),
  },
  {
    value: 'phone',
    label: 'CELULAR',
    validation: z.string().refine((e: string) => e.replace(/\D/g, "").length == 10 || e.replace(/\D/g, "").length == 11, 'O celular deve ter 10-11 números.').optional().or(z.literal('')),
    mask: ['(', /\d/, /\d/, ')', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
  },
  {
    value: 'telephone',
    label: 'TELEFONE',
    validation: z.string().refine((e: string) => e.replace(/\D/g, "").length == 10, 'O telefone deve ter 10-11 números.').optional().or(z.literal('')),
    mask: ['(', /\d/, /\d/, ')', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
  }
];

// const factory = {
//   "representative": "",
//   "discount": "",
//   "direct_sale": "",
//   "link_catalog": "https://exemplo.com.br",
//   "link_table": "",
//   "link_site": "",
//   "pricing": 1,
//   "style": "Contemporâneo",
//   "ambient": "Interno"
// }

// const contact = [
//   {
//     "name": "nome contato",
//     "detail": "detalhe",
//     "phone": "(00)00000-0000",
//     "telephone": "(00)0000-0000"
//   }
// ]

// const address = {
//   "cep": "00000-000",
//   "address": "endereço",
//   "number": "000",
//   "state": "DF",
//   "city": "Brasília",
//   "complement": "complemento",
// }

// const payment = {
//   "pix": "619982398",
//   "account": "0000000-0",
//   "agency": "",
//   "bank": "banco",
// }

// const info = {
//   name: 'nome',
//   fantasy_name: 'fantasia',
//   info_email: '',
//   cnpj: '00.000.000/0000-00',
//   tax_payer: "Não Informado",
//   state_register: "000.000.000.000",
//   municipal_register: "000.000.000.000",
//   address: address,
// }

// const person = {
//   contact: contact,
//   info: info,
//   payment: payment,
//   observations: "observacoes",
// }