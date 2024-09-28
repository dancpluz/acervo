import { DocumentReference, FieldValue } from "firebase/firestore";

export type PersonT = {
  id: string;
  label?: string
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
  name?: string;
  surname?: string;
  cpf?: string;
  rg?: string;
  tax_address: AddressT;
  shipping_address?: AddressT | '';
  info_email: string;
  company_name?: string;
  fantasy_name?: string;
  cnpj?: string;
  tax_payer?: string;
  municipal_register?: string;
  state_register?: string;
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
  id: string;
  person: PersonT | DocumentReference;
  representative: DocumentReference | RepresentativeT | '';
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
  id: string;
  person: PersonT | DocumentReference;
  team: WorkerT[];
  last_updated: FieldValue | Date | { seconds: number, nanoseconds: number };
}

export type OfficeT = {
  id: string;
  person: PersonT | DocumentReference;
  team: WorkerT[];
  last_updated: FieldValue | Date | { seconds: number, nanoseconds: number };
}

export type ClientT = {
  id: string;
  person: PersonT | DocumentReference;
  office: DocumentReference | OfficeT | '';
  order: OrderT[];
  last_updated: FieldValue | Date | { seconds: number, nanoseconds: number };
}

export type OrderT = {
  id_order: string;
  date: Date;
  state: string;
  cep: string;
  city: string;
  address: string;
  number: string;
  complement: string;
}

export type CollaboratorT = {
  id: string;
  person: PersonT | DocumentReference;
  role: string;
  last_updated: FieldValue | Date | { seconds: number, nanoseconds: number };
}

export type ServiceT = {
  id: string;
  person: PersonT | DocumentReference;
  service: string;
  last_updated: FieldValue | Date | { seconds: number, nanoseconds: number };
}

export type MarkupT = {
  id: string;
  name: string;
  observation: string;
  "12x": number | string;
  "6x": number | string;
  cash: number | string;
}

export type FreightT = {
  id: string;
  region: string;
  fee: number | string;
}

export type ProspectionT = {
  id: string;
  title: string;
  tax: number | string;
}

export type FinishT = {
  width: number;
  height: number;
  depth: number;
  designer?: string;
  frame: string;
  fabric: string;
  extra: string;
  // fabric_img?: string;
  // frame_img?: string;
  // extra_img?: string;
  link_finishes?: string;
  link_3d?: string;
}

export type ProductT = {
  id: string; // Numero_categoria_nome do produto_custo_data de criação
  name: string;
  ambient?: string;
  enabled: boolean;
  quantity: number;
  category: string;
  finish: FinishT;
  //image: string;
  observations?: string;
  factory: FactoryT | DocumentReference;
  freight: FreightT | DocumentReference;
  cost: number;
  markup: MarkupT | DocumentReference;
  created_at: Date | { seconds: number, nanoseconds: number };
}

export type ActionT = {
  date: Date | { seconds: number, nanoseconds: number };
  description?: string;
  collaborator: CollaboratorT | DocumentReference;
}

export type ProposalT = {
  id: string; // Numero_nome do projeto_cliente_escritório_colaborador_data de criação 
  num: number;
  name: string;
  priority: string;
  status: string;
  collaborator: string | CollaboratorT | DocumentReference;
  client: string | ClientT | DocumentReference;
  office: string | OfficeT | DocumentReference;
  client_type?: string;
  project_type?: string;
  origin?: string;
  observations?: string;
  actions?: ActionT[];
  products?: ProductT[];
  total: number;
  created_at: Date | { seconds: number, nanoseconds: number };
  last_updated: Date | { seconds: number, nanoseconds: number };
}