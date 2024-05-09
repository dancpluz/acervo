'use server'

import db from "@/lib/firebase";
import { collection, query, or, getDocs, getDoc, where } from "firebase/firestore";
import { FactoryT, PersonT } from '@/lib/types';

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

export async function getFactory(param?: string): Promise<FactoryT[]> {
  try {
    const querySnapshot = await getDocs(query(collection(db, "factory")));
    const factoryData = await Promise.all(querySnapshot.docs.map(async (doc: any) => {
      const data = doc.data();
      const personRef = await getDoc(data.person);
      const person = personRef.data() as PersonT; // Add type assertion here
      person.timestamp = new Date((person.timestamp as { seconds: number }).seconds * 1000);
      return { ...data, person };
    }))

    return factoryData;
  } catch (error) {
    console.log(error);
    return [];
    //throw new Error("Ocorreu um erro ao buscar as fábricas")
  }
}
