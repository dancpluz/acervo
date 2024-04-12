enum environmentEnum {
  "Interno",
  "Externo",
  "Interno e Externo"
}

enum styleEnum {
  "Moderno",
  "Clássico",
  "Rústico",
  "Industrial",
  "Outro"
}

type Person = {
  //user: User;
  //birth_date: string;
  phone: Contact;
}

type Contact = {
  name: string;
  detail: string;
  phone: string;
  telephone: string;
}

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

export type Factory = {
  person: Person;
  //representative: Representative;
  direct_sale: number;
  pricing: 1 | 2 | 3 | 4 | 5;
  environment: environmentEnum;
  style: styleEnum;
  link_table: string;
  link_catalog: string;
  site: string;
}