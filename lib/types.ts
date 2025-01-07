import { DocumentReference, FieldValue, Timestamp } from "firebase/firestore";

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
  representative: DocumentReference | RepresentativeT | string | '';
  pricing: number;
  ambient: string;
  style: string;
  direct_sale: number;
  discount: number;
  link_table: string;
  link_catalog: string;
  link_site: string;
  last_updated: FieldValue | Date | Timestamp;
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
  last_updated: FieldValue | Date | Timestamp;
}

export type OfficeT = {
  id: string;
  person: PersonT | DocumentReference;
  team: WorkerT[];
  last_updated: FieldValue | Date | Timestamp;
}

export type ClientT = {
  id: string;
  person: PersonT | DocumentReference;
  office: DocumentReference | OfficeT | '';
  order: OrderT[];
  last_updated: FieldValue | Date | Timestamp;
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
  last_updated: FieldValue | Date | Timestamp;
}

export type ServiceT = {
  id: string;
  person: PersonT | DocumentReference;
  service: string;
  last_updated: FieldValue | Date | Timestamp;
}

export type MarkupT = {
  id: string;
  name: string;
  label: string;
  observation: string;
  "12x": number | string;
  "6x": number | string;
  cash: number | string;
}

export type FreightT = {
  id: string;
  region: string;
  label: string;
  fee: number | string;
}

export type ProspectionT = {
  id: string;
  title: string;
  label: string;
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
  fabric_img?: ImageT | '';
  frame_img?: ImageT | '';
  extra_img?: ImageT | '';
  link_finishes?: string;
  link_3d?: string;
}

export type ImageT = {
  path: string;
  width: number;
  height: number;
}

export type ProductT = {
  id: string; // Numero_categoria_nome do produto_data de criação
  num: number;
  name: string;
  ambient?: string;
  enabled: boolean;
  quantity: number;
  category: string;
  finish: FinishT;
  image: ImageT | '';
  observations?: string;
  factory: FactoryT | DocumentReference | '';
  freight: FreightT | DocumentReference | '';
  cost: number;
  markup: MarkupT | DocumentReference | '';
  created_at: Date | Timestamp;
}

export type ActionT = {
  id: string;
  done: boolean;
  date: Date | Timestamp;
  description?: string;
  collaborator: CollaboratorT | DocumentReference | string;
}

export type ComplementT = {
  discount: number,
  freight: number,
  expiration: number,
  deadline: number,
  payment_method: 'credit' | 'debit' | 'boleto' | 'pix',
  general_info: string,
  info: string,
}

export type VersionT = {
  num: number;
  products: ProductT[];
  complement: ComplementT;
  created_at: Date | Timestamp;
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
  versions: VersionT[];
  created_at: Date | Timestamp;
  last_updated: Date | Timestamp;
}