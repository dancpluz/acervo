import { z } from "zod";
import cidades from '@/lib/cidades.json';

type Field = {
  [key: string]: {
    value: string;
    label: string;
    placeholder: string;
    validation: z.ZodType<any, any>;
    mask?: (string | RegExp)[];
    items?: string[] | { [key: string]: string[] };
  };
};

export const fields: Field = {
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
  email: {
    value: 'email',
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
    placeholder: 'Selecione',
    validation: z.string().min(1, 'Selecione o tipo de contribuinte'),
    items: ["Não Informado","Contribuinte isento de inscrição no cadastro de contribuintes do ICMS", "Não Contribuinte, que pode ou não possuir inscrição estadual no cadastro ICMS"]
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
    validation: z.coerce.number().optional().or(z.literal('')),
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
    validation: z.string().max(50, 'Máximo de 50 caracteres.').optional().or(z.literal('')).transform((e?: string) => e ? e.replace(/\D/g, "") : e),
  },
  number: {
    value: 'number',
    label: 'NÚMERO',
    placeholder: 'Ex. 123',
    validation: z.coerce.number().optional().or(z.literal('')),
  },
  state: {
    value: 'state',
    label: 'ESTADO',
    placeholder: 'Ex. DF',
    validation: z.string().optional().or(z.literal('')),
    items: Object.keys(cidades),
  },
  city: {
    value: 'city',
    label: 'CIDADE',
    placeholder: 'Ex. Brasília',
    validation: z.string().optional().or(z.literal('')),
    items: cidades,
  },
  complement: {
    value: 'complement',
    label: 'COMPLEMENTO',
    placeholder: ' Ex. Jardim Santos Dumont I',
    validation: z.string().max(50, 'Máximo de 50 caracteres.').optional().or(z.literal('')),
  },
  representative: {
    value: 'representative',
    label: 'REPRESENTAÇÃO',
    placeholder: 'Ex. Punto',
    validation: z.string().optional().or(z.literal('')),
    items: []
  }
}

export const tableFields = [
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
    mask: ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
  },
  {
    value: 'telephone',
    label: 'TELEFONE',
    validation: z.string().refine((e: string) => e.replace(/\D/g, "").length == 10, 'O telefone deve ter 10-11 números.').optional().or(z.literal('')),
    mask: ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
  }
]
