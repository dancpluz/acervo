import { z } from "zod";

const environmentEnum = ["Interno", "Externo", "Interno e Externo"] as const;
const styleEnum = ["Moderno", "Clássico", "Rústico", "Industrial", "Outro"] as const;

const contactSchema = z.object({
  name: z.string(),
  detail: z.string(),
  phone: z.string().optional(),
  telephone: z.string().optional(),
});

const infoSchema = z.object({
  name: z.string(),
  surname: z.string(),
  cpf: z.string(),
  rg: z.string(),
  tax_address: z.object({
    state: z.string(),
    cep: z.string(),
    city: z.string(),
    address_name: z.string(),
    number: z.string(),
    complement: z.string(),
  }),
  shipping_address: z.object({
    state: z.string(),
    cep: z.string(),
    city: z.string(),
    address_name: z.string(),
    number: z.string(),
    complement: z.string(),
  }),
  info_email: z.string(),
  fantasy_name: z.string(),
  cnpj: z.string(),
  tax_payer: z.enum(["0", "1"]),
  municipal_register: z.string(),
  state_register: z.string(),
});

const personSchema = z.object({
  id: z.string(),
  phone: contactSchema,
  info: infoSchema,
});


const factorySchema = z.object({
  id: z.string(),
  person: personSchema,
  //representative, 
  direct_sale: z.number().optional(),
  pricing: z.number().positive().int().lte(5),
  environment: z.enum(environmentEnum),
  style: z.enum(styleEnum),
  link_table: z.string().optional(),
  link_catalog: z.string().optional(),
  site: z.string().optional(),
});

type Person = z.infer<typeof personSchema>;

type Contact = z.infer<typeof contactSchema>;

export type Factory = z.infer<typeof factorySchema>;

type Payment = {
  pix: string;
  account: string;
  bank: string;
  agency: string;
}

type Info = {
  name: string;
  surname: string;
  cpf: string;
  rg: string;
  tax_address: Address;
  shipping_address: Address;
  info_email: string;
  fantasy_name: string;
  cnpj: string;
  tax_payer: "0" | "1";
  municipal_register: string;
  state_register: string;
}

type Address = {
  state: string;
  cep: string;
  city: string;
  address_name: string;
  number: string;
  complement: string;
}
