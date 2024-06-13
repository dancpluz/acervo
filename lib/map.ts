import * as Types from '@/lib/types';
import { DocumentReference, serverTimestamp } from "firebase/firestore";

export async function mapPerson(values: any, person_type: string): Promise<Types.PersonT> {
  return {
    contact: values.contact,
    info: await mapInfo(values, person_type),
    payment: await mapPayment(values),
    observations: values.observations,
  }
}

async function mapPayment(values: any): Promise<Types.PaymentT> {
  return {
    pix: values.pix,
    account: values.account,
    agency: values.agency,
    bank: values.bank
  }
}

async function mapInfo(values: any, person_type: string): Promise<Types.InfoT> {
  if (person_type === 'Física') {
    return {
      name: values.name,
      surname: values.surname,
      cpf: values.cpf,
      rg: values.rg,
      shipping_address: values.shipping ? await mapAddress(values.shipping) : '',
      tax_address: await mapAddress(values),
      info_email: values.info_email,
    }
  } else {
    return {
      company_name: values.company_name,
      fantasy_name: values.fantasy_name,
      info_email: values.info_email,
      cnpj: values.cnpj,
      tax_payer: values.tax_payer,
      state_register: values.state_register,
      municipal_register: values.municipal_register,
      tax_address: await mapAddress(values),
      shipping_address: values.shipping ? await mapAddress(values.shipping) : '',
    }
  }
}

async function mapAddress(values: any): Promise<Types.AddressT> {
  return {
    cep: values.cep,
    address: values.address,
    number: values.number,
    state: values.state,
    city: values.city,
    complement: values.complement
  }
}

export async function mapFactory(values: any, personRef: DocumentReference): Promise<Types.FactoryT> {
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

export async function mapRepresentative(values: any, personRef: DocumentReference): Promise<Types.RepresentativeT> {
  return {
    person: personRef,
    team: values.team,
    last_updated: serverTimestamp(),
  }
}

export async function mapOffice(values: any, personRef: DocumentReference): Promise<Types.OfficeT> {
  return {
    person: personRef,
    team: values.team,
    last_updated: serverTimestamp(),
  }
}

export async function mapOrder(values: any): Promise<Types.OrderT> {
  return {
    id_order: values.id_order,
    date: values.date,
    cep: values.cep,
    address: values.address,
    number: values.number,
    state: values.state,
    city: values.city,
    complement: values.complement
  }
}

export async function mapClient(values: any, personRef: DocumentReference): Promise<Types.ClientT> {
  return {
     person: personRef,
     order: await Promise.all(values.order.map((obj: Types.OrderT) => mapOrder(obj))),
     office: values.office,
     last_updated: serverTimestamp(),
  }
}

export async function mapCollaborator(values: any, personRef: DocumentReference): Promise<Types.CollaboratorT> {
  return {
     person: personRef,
     role: values.role,
     last_updated: serverTimestamp(),
  }
}

export async function mapService(values: any, personRef: DocumentReference): Promise<Types.ServiceT> {
  return {
     person: personRef,
     service: values.service,
     last_updated: serverTimestamp(),
  }
}