import { DocumentReference } from "firebase/firestore";
import { z } from "zod";

const environmentEnum = ["Interno", "Externo", "Interno e Externo"] as const;
const styleEnum = ["Moderno", "Clássico", "Rústico", "Industrial", "Outro"] as const;

const contactSchema = z.object({
  name: z.string(),
  detail: z.string(),
  phone: z.string().optional(),
  telephone: z.string().optional(),
});

const addressSchema = z.object({
  state: z.string(),
  cep: z.string(),
  city: z.string(),
  address_name: z.string(),
  number: z.string().optional(),
  complement: z.string().optional(),
});

const paymentSchema = z.object({
  pix: z.string(),
  account: z.string().optional(),
  bank: z.string().optional(),
  agency: z.string().optional(),
});

const infoSchema = z.object({
  name: z.string(),
  surname: z.string().optional(),
  cpf: z.string().optional(),
  rg: z.string().optional(),
  tax_address: addressSchema.optional(),
  shipping_address: addressSchema.optional(),
  info_email: z.string(),
  fantasy_name: z.string().optional(),
  cnpj: z.string().optional(),
  tax_payer: z.enum(["0", "1"]).optional(),
  municipal_register: z.string().optional(),
  state_register: z.string().optional(),
});

const personSchema = z.object({
  id: z.string(),
  contact: contactSchema.array().optional(),
  info: infoSchema,
  payment: paymentSchema,
  observations: z.string().optional(),
});

const workerSchema = z.object({
  name: z.string(),
  role: z.string(),
  email: z.string(),
  payment: paymentSchema,
});

const representativeSchema = z.object({
  id: z.string(),
  person: z.object({}).refine(
    (x: object): x is DocumentReference => x instanceof DocumentReference,
  ),
  team: workerSchema.array().optional(),
});

const factorySchema = z.object({
  id: z.string(),
  person: z.object({}).refine(
    (x: object): x is DocumentReference => x instanceof DocumentReference,
  ),
  representative: z.object({}).refine(
    (x: object): x is DocumentReference => x instanceof DocumentReference,
  ),
  pricing: z.number().positive().int().lte(5),
  environment: z.enum(environmentEnum),
  style: z.enum(styleEnum),
  direct_sale: z.number().optional(),
  discount: z.number().optional(),
  link_table: z.string().optional(),
  link_catalog: z.string().optional(),
  site: z.string().optional(),
});


type Person = z.infer<typeof personSchema>;

type Contact = z.infer<typeof contactSchema>;

export type Factory = z.infer<typeof factorySchema>;

type Payment = z.infer<typeof paymentSchema>;

type Info = z.infer<typeof infoSchema>;

type Address = z.infer<typeof addressSchema>;

type Worker = z.infer<typeof workerSchema>;

type Representative = z.infer<typeof representativeSchema>;
