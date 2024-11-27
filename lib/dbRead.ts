'use server'

import db from "@/lib/firebase";
import { collection, query, getDocs, where } from "firebase/firestore";

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