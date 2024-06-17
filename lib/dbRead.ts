'use server'

import db from "@/lib/firebase";
import { collection, query, or, orderBy, getDocs, getDoc, where } from "firebase/firestore";
import * as Types from '@/lib/types';

export async function documentExists(obj: { [key: string]: { query: string, value: string }[] }): Promise<boolean> {
  // Checks in the database if a document with the input values already 
  // Really complex function, maybe refactor later
  let exists = false;

  try {
    for (const col of Object.keys(obj)) {
      const queries = obj[col].map(async (e) => where(e.query, "==", e.value));
      const snapshots = await Promise.all(queries);

      const mergedQueries = query(collection(db, col), or(...snapshots));

      const querySnapshot = await getDocs(mergedQueries);

      querySnapshot.forEach((doc) => {
        if (doc.exists()) {exists = true}
      });
    }
  } catch (error) {
    console.log(error);
    //throw new Error("Ocorreu um erro ao verificar a existência de um documento");
  }

  return exists;
}

export async function getFactory(): Promise<Types.FactoryT[]> {
  try {
    const querySnapshot = await getDocs(query(collection(db, "factory"), orderBy("last_updated", "desc")));
    const factoryData = await Promise.all(querySnapshot.docs.map(async (doc: any) => {
      const data = doc.data();
      let representative = data.representative;
      // MUITO TOSCO, MUDE DPS
      if (representative) {
        const representativeRef = await getDoc(data.representative);
        const representativeData = representativeRef.data() as any;
        representative = {
          ref: representativeRef.id,
          label: representativeData.info.fantasy_name ? representativeData.info.company_name + ' - ' + representativeData.info.fantasy_name : representativeData.info.company_name,
          info_email: representativeData.info.info_email,
          contact: representativeData.contact,
        }
      }
      const personRef = await getDoc(data.person);
      const person = personRef.data() as Types.PersonT;
      data.last_updated = new Date((data.last_updated as { seconds: number }).seconds * 1000);
      return { ...data, person, representative, refs: { person: personRef.id, factory: doc.id } };
    }))

    return factoryData;
  } catch (error) {
    console.log(error);
    return [];
    
  }
}

export async function getRepresentative(): Promise<Types.RepresentativeT[]> {
  try {
    const querySnapshot = await getDocs(query(collection(db, "representative"), orderBy("last_updated", "desc")));
    const representativeData = await Promise.all(querySnapshot.docs.map(async (doc: any) => {
      const data = doc.data();
      const personRef = await getDoc(data.person);
      const person = personRef.data() as Types.PersonT;
      data.last_updated = new Date((data.last_updated as { seconds: number }).seconds * 1000);
      return { ...data, person, refs: { person: personRef.id, representative: doc.id } };
    }))

    return representativeData;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getRepresentativeItems(): Promise<Types.ReferenceT[]> {
  try {
    const querySnapshot = await getDocs(query(collection(db, "representative"), orderBy("last_updated", "desc")));
    const representativeData = await Promise.all(querySnapshot.docs.map(async (doc: any) => {
      const data = doc.data();
      const personRef = await getDoc(data.person);
      const person = personRef.data() as Types.PersonT;
      return { ref: personRef.id, label: person.info.fantasy_name ? person.info.company_name + ' - ' + person.info.fantasy_name : person.info.company_name, info_email: person.info.info_email, contact: person.contact } as Types.ReferenceT;
    }))

    return representativeData;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getOffice(): Promise<Types.OfficeT[]> {
  try {
    const querySnapshot = await getDocs(query(collection(db, "office"), orderBy("last_updated", "desc")));
    const officeData = await Promise.all(querySnapshot.docs.map(async (doc: any) => {
      const data = doc.data();
      const personRef = await getDoc(data.person);
      const person = personRef.data() as Types.PersonT;
      data.last_updated = new Date((data.last_updated as { seconds: number }).seconds * 1000);
      return { ...data, person, refs: { person: personRef.id, office: doc.id } };
    }))

    return officeData;
  } catch (error) {
    console.log(error);
    return [];
    
  }
}

export async function getClient(): Promise<Types.ClientT[]> {
  try {
    const querySnapshot = await getDocs(query(collection(db, "client"), orderBy("last_updated", "desc")));
    const clientData = await Promise.all(querySnapshot.docs.map(async (doc: any) => {
      const data = doc.data();
      const personRef = await getDoc(data.person);
      const person = personRef.data() as Types.PersonT;
      data.last_updated = new Date((data.last_updated as { seconds: number }).seconds * 1000);
      return { ...data, person, refs: { person: personRef.id, client: doc.id } };
    }))

    return clientData;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getCollaborator(): Promise<Types.CollaboratorT[]> {
  try {
    const querySnapshot = await getDocs(query(collection(db, "collaborator"), orderBy("last_updated", "desc")));
    const collaboratorData = await Promise.all(querySnapshot.docs.map(async (doc: any) => {
      const data = doc.data();
      const personRef = await getDoc(data.person);
      const person = personRef.data() as Types.PersonT;
      data.last_updated = new Date((data.last_updated as { seconds: number }).seconds * 1000);
      return { ...data, person, refs: { person: personRef.id, collaborator: doc.id } };
    }))

    return collaboratorData;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getService(): Promise<Types.ServiceT[]> {
  try {
    const querySnapshot = await getDocs(query(collection(db, "service"), orderBy("last_updated", "desc")));
    const serviceData = await Promise.all(querySnapshot.docs.map(async (doc: any) => {
      const data = doc.data();
      const personRef = await getDoc(data.person);
      const person = personRef.data() as Types.PersonT;
      data.last_updated = new Date((data.last_updated as { seconds: number }).seconds * 1000);
      return { ...data, person, refs: { person: personRef.id, service: doc.id } };
    }))

    return serviceData;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getMarkup(): Promise<Types.MarkupT[]> {
  try {
    const markupCollection = collection(db, "config", "PtwUlMicmRBxL9Noe8K1", "markup");
    const querySnapshot = await getDocs(markupCollection);
    //console.log(querySnapshot)
    const markupData = await Promise.all(querySnapshot.docs.map(async (doc: any) => {
      const data = doc.data();
      return {...data, ref: doc.id};
    }))

    return markupData;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getFreight(): Promise<Types.FreightT[]> {
  try {
    const freightCollection = collection(db, "config", "PtwUlMicmRBxL9Noe8K1", "freight");
    const querySnapshot = await getDocs(freightCollection);
    const freightData = await Promise.all(querySnapshot.docs.map(async (doc: any) => {
      const data = doc.data();
      return { ...data, ref: doc.id};
    }))

    return freightData;
  } catch (error) {
    console.log(error);
    return [];
  }
}