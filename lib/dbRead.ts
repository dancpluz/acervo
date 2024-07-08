'use server'

import db from "@/lib/firebase";
import { collection, query, orderBy, getDocs, getDoc, where } from "firebase/firestore";
import { PersonT, ReferenceT } from '@/lib/types';
import { formatRefEntity } from '@/lib/utils';

export async function checkExistingFields(values: any, check: string[][]) {
  try {
    const found: { [key: string]: [string, number] } = {};

    for (const path of check) {
      const value = path.reduce((acc, key) => (acc && acc[key] !== 'undefined') ? acc[key] : undefined, values)
      if (value === '') {continue}

      const querySnapshot = await getDocs(query(collection(db, path[0]), where(path.slice(1).join('.'), "==", value)));
  
      if (querySnapshot.size !== 0) {
        found[path[path.length-1]] = [value, querySnapshot.size];
      }
    }

    return found;
  } catch (error) {
    console.log(error)
    throw new Error("Ocorreu um erro ao verificar a existência de um documento");
  }
}

export async function getEntities(entity: string, entityRef?: string) {
  try {
    const querySnapshot = await getDocs(query(collection(db, entity), orderBy("last_updated", "desc")));
    const entityData = await Promise.all(querySnapshot.docs.map(async (doc: any) => {
      const data = doc.data();
      let refData: '' | ReferenceT = '';
      // Puxa info se tiver outra referência nos atributos
      if (entityRef && data[entityRef]) {
        const ref = await getDoc(data[entityRef]) as any;
        const refPerson = await getDoc(ref.data().person);
        refData = { ...formatRefEntity(entityRef, refPerson.data()), ref: refPerson.id } as ReferenceT;
      }
      const personRef = await getDoc(data.person);
      const person = personRef.data() as PersonT;
      data.last_updated = new Date((data.last_updated as { seconds: number }).seconds * 1000);

      const result = { ...data, person, refs: { person: personRef.id } }
      result.refs[entity] = doc.id;
      if (entityRef) {
        result[entityRef] = refData;
      }
      return result;
    }))

    return entityData;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getEntitiesOptions(entity: string): Promise<ReferenceT[]> {
  try {
    const querySnapshot = await getDocs(query(collection(db, entity), orderBy("last_updated", "desc")));
    const entityData = await Promise.all(querySnapshot.docs.map(async (doc: any) => {
      const data = doc.data();
      const personRef = await getDoc(data.person);
      const person = personRef.data() as PersonT;
      return { ...formatRefEntity(entity, person), ref: personRef.id } as ReferenceT;
    }))

    return entityData;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getConfig(subcollection: string, config: string) {
  try {
    const configCollection = collection(db, "config", subcollection, config);
    const querySnapshot = await getDocs(configCollection);

    const configData = await Promise.all(querySnapshot.docs.map(async (doc: any) => {
      const data = doc.data();
      return {...data, ref: doc.id};
    }))

    return configData;
  } catch (error) {
    console.log(error);
    return [];
  }
}