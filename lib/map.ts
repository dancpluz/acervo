import { PaymentT, PersonT, AddressT, FactoryT, InfoT, RepresentativeT } from "@/lib/types";
import { DocumentReference, serverTimestamp } from "firebase/firestore";

export async function mapPerson(values: any): Promise<PersonT> {
  return {
    contact: values.contact,
    info: await mapInfo(values),
    payment: await mapPayment(values),
    observations: values.observations,
  }
}

async function mapPayment(values: any): Promise<PaymentT> {
  return {
    pix: values.pix,
    account: values.account,
    agency: values.agency,
    bank: values.bank
  }
}

async function mapInfo(values: any): Promise<InfoT> {
  return {
    name: values.name,
    fantasy_name: values.fantasy_name,
    info_email: values.info_email,
    cnpj: values.cnpj,
    tax_payer: values.tax_payer,
    state_register: values.state_register,
    municipal_register: values.municipal_register,
    tax_address: await mapAddress(values),
  }
}

async function mapAddress(values: any): Promise<AddressT> {
  return {
    cep: values.cep,
    address: values.address,
    number: values.number,
    state: values.state,
    city: values.city,
    complement: values.complement
  }
}

export async function mapFactory(values: any, personRef: DocumentReference): Promise<FactoryT> {
  return {
    person: personRef,
    representative: values.representative,
    pricing: Number(values.pricing),
    ambient: values.ambient,
    style: values.style,
    direct_sale: values.bool_direct_sale === 'Sim' ? values.direct_sale === '' ? 0 : values.direct_sale : '',
    discount: values.discount,
    link_table: values.link_table,
    link_catalog: values.link_catalog,
    link_site: values.link_site,
    last_updated: serverTimestamp(),
  }
}

export async function mapRepresentative(values: any, personRef: DocumentReference): Promise<RepresentativeT> {
  return {
     person: personRef,
     team: values.team,
     last_updated: serverTimestamp(),
  }
}