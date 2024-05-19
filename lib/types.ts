import { DocumentReference, FieldValue } from "firebase/firestore";

export enum PricingEnum {
  $ = '1',
  $$ = '2',
  $$$ = '3',
  $$$$ = '4',
  $$$$$ = '5',
}

export enum StyleEnum {
  Contemporaneo = 'Contemporâneo',
  Classico = 'Clássico',
  Rustico = 'Rústico',
  Moderno = 'Moderno'
}

export enum AmbientEnum {
  Interno = 'Interno',
  Externo = 'Externo',
  Int_Externo = 'Int. e Externo'
}

export enum TaxEnum {
  NaoInfo = "Não Informado",
  Contribuinte = "Contribuinte isento de inscrição no cadastro de contribuintes do ICMS",
  NContribuinte = "Não Contribuinte, que pode ou não possuir inscrição estadual no cadastro ICMS"
}

export type PersonT = {
  contact: ContactT[];
  info: InfoT;
  payment: PaymentT;
  observations: string;
}

export type ContactT = {
  name: string;
  detail: string;
  phone: string;
  telephone: string;
}

export type PaymentT = {
  pix: string;
  account: string;
  bank: string;
  agency: string;
}

export type InfoT = {
  name: string;
  surname?: string;
  cpf?: string;
  rg?: string;
  tax_address: AddressT;
  shipping_address?: AddressT;
  info_email: string;
  fantasy_name: string;
  cnpj: string;
  tax_payer: TaxEnum;
  municipal_register: string;
  state_register: string;
}

export type AddressT = {
  state: string;
  cep: string;
  city: string;
  address: string;
  number: string;
  complement: string;
}

export type FactoryT = {
  person: PersonT | DocumentReference;
  representative: string;
  pricing: number;
  ambient: string;
  style: string;
  direct_sale: number;
  discount: number;
  link_table: string;
  link_catalog: string;
  link_site: string;
  last_updated: FieldValue | Date | { seconds: number, nanoseconds: number };
}

export type WorkerT = {
  name: string;
  role: string;
  email: string;
  payment: PaymentT;
}

export type RepresentativeT = {
  person: PersonT | DocumentReference;
  team: WorkerT[];
  last_updated: FieldValue | Date | { seconds: number, nanoseconds: number };
  refs?: { [key: string]: string };
}