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
  items?: string[] | { [key: string]: string[] };
};

export type EnumFieldT = {
  value: string;
  label: string;
  validation: z.ZodType<any, any>;
  items: string[];
};

export type TableFieldT = {
  value: string;
  label: string;
  validation: z.ZodType<any, any>;
  placeholder?: string;
  mask?: (string | RegExp)[];
  size?: string;
};

export const fields: { [key: string]: FieldT } = {
  company_name: {
    value: 'company_name',
    label: 'NOME OU RAZÃO SOCIAL*',
    placeholder: 'Ex. ACERVO MOBILIA COMERCIO VAREJISTA DE MOVEIS LTDA',
    validation: z.string().min(1, 'Campo não preenchido.').max(150, 'Máximo de 150 caracteres.').nullable(),
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
    validation: z.string().min(1, 'Campo não preenchido.').max(150, 'Máximo de 150 caracteres.').nullable(),
  },
  surname: {
    value: 'surname',
    label: 'SOBRENOME*',
    placeholder: 'Ex. Turchi',
    validation: z.string().min(1, 'Campo não preenchido.').max(150, 'Máximo de 150 caracteres.').nullable(),
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
    validation: z.string().refine((e: string) => e.replace(/\D/g, "").length == 14, 'O CNPJ deve ter 14 números.').nullable(),
    mask: [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/],
  },
  tax_payer: {
    value: 'tax_payer',
    label: 'CONTRIBUINTE*',
    placeholder: 'Selecione contribuinte',
    validation: z.nativeEnum(TaxEnum, { required_error: 'Campo não preenchido.' }).nullable(),
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
    placeholder: 'Selecione um banco',
    validation: z.string().optional().or(z.literal('')),
    items: bancos
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
    validation: z.any().optional().or(z.literal('')),
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
    items: []
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
  pricing: {
    value: 'pricing',
    label: 'PADRÃO*',
    validation: z.nativeEnum(PricingEnum, { required_error: 'Campo não preenchido.' }),
    items: Object.values(PricingEnum),
  },
  style: {
    value: 'style',
    label: 'ESTILO',
    validation: z.nativeEnum(StyleEnum).optional().or(z.literal('')),
    items: Object.values(StyleEnum),
  },
  ambient: {
    value: 'ambient',
    label: 'AMBIENTE*',
    validation: z.nativeEnum(AmbientEnum, { required_error: 'Campo não preenchido.' }),
    items: Object.values(AmbientEnum),
  },
  bool_direct_sale: {
    value: 'bool_direct_sale',
    label: 'VENDA DIRETA?',
    validation: z.string({ required_error: 'Campo não preenchido.' }),
    items: ['Sim', 'Não'],
  },
  bool_person_type: {
    value: 'bool_person_type',
    label: 'TIPO DE PESSOA',
    validation: z.enum(['Física', 'Jurídica']).optional(),
    items: ['Física', 'Jurídica'],
  }
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
  region: {
    value: 'region',
    label: '',
    placeholder: 'Ex. 2',
    validation: z.string().min(1, 'Campo não preenchido.'),
  },
  fee: {
    value: 'fee',
    label: '',
    placeholder: 'Ex. 2',
    validation: z.string().transform((val) => Number((Number(`${val}`.replace(",", ".")) / 100).toFixed(4))).pipe(z.number({ invalid_type_error: 'Somente números.' }).gt(0, 'O taxa deve ser maior que 0, se quiser Grátis, apague').lte(1, 'O desconto não pode ser maior que 100%.')).or(z.literal('')),
  },
};


export const orderFields: { [key: string]: FieldT } = {
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
  state: fields.state,
  city: fields.city,
  complement: fields.complement
};

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