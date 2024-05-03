'use server'

import db from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { PaymentT, ContactT, PersonT, AddressT, FactoryT, InfoT } from "@/lib/types";
import { revalidatePath } from 'next/cache'

export async function addFactory(values: any) {
  // Add a new factory to the database
  try {
    const address: AddressT = {
      cep: values.cep,
      address: values.address,
      number: values.number,
      state: values.state,
      city: values.city,
      complement: values.complement
    }
  
    const payment: PaymentT = {
      pix: values.pix,
      account: values.account,
      agency: values.agency,
      bank: values.bank
    }
    
    const contact: ContactT[] = values.contact;
  
    const info: InfoT = {
      name: values.name,
      fantasy_name: values.fantasy_name,
      info_email: values.info_email,
      cnpj: values.cnpj,
      tax_payer: values.tax_payer,
      state_register: values.state_register,
      municipal_register: values.municipal_register,
      tax_address: address,
    }
  
    const person: PersonT = {
      contact: contact,
      info: info,
      payment: payment,
      observations: values.observations,
      timestamp: serverTimestamp(),
    }
  
    const personRef = await addDoc(collection(db, "person"), person);
  
    const factory: FactoryT = {
      person: personRef,
      representative: values.representative,
      discount: values.discount,
      direct_sale: values.direct_sale,
      link_catalog: values.link_catalog,
      link_table: values.link_table,
      link_site: values.link_site,
      pricing: Number(values.pricing),
      style: values.style,
      ambient: values.ambient
    }
  
    await addDoc(collection(db, "factory"), factory);
    revalidatePath('/cadastros')
  } catch (error) {
    throw new Error('Ocorreu um erro ao adicionar a fábrica')
  }
}  