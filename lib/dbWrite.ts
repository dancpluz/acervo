'use server'

import db from "@/lib/firebase";
import { collection, addDoc, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { mapPerson, mapFactory, mapRepresentative } from "@/lib/map"
import { revalidatePath } from 'next/cache';

export async function addFactory(values: any) {
  // Add a new factory to the database
  try {
    const person = await mapPerson(values);
  
    const personRef = await addDoc(collection(db, "person"), person);

    const factory = await mapFactory(values, personRef);
  
    await addDoc(collection(db, "factory"), factory);
    revalidatePath('/cadastros')
  } catch (error) {
    console.log(error);
  }
}

export async function updateFactory(ids: { [key: string]: string }, values: any) {
  // Update a factory to the database
  try {
    const person = await mapPerson(values);
  
    const personRef = doc(db, 'person', ids.person);

    await updateDoc(personRef, person);

    const factory = await mapFactory(values, personRef);

    const factoryRef = doc(db, 'factory', ids.factory)
    await updateDoc(factoryRef, factory);
    revalidatePath('/cadastros')
  } catch (error) {
    console.log(error);
  }
}

export async function addRepresentative(values: any) {
  // Add a new representative to the database
  try {
    const person = await mapPerson(values);
  
    const personRef = await addDoc(collection(db, "person"), person);

    const representative = await mapRepresentative(values, personRef);
  
    await addDoc(collection(db, "representative"), representative);
    revalidatePath('/cadastros')
  } catch (error) {
    console.log(error);
  }
}

export async function updateRepresentative(ids: { [key: string]: string }, values: any) {
  // Update a representative to the database
  try {
    const person = await mapPerson(values);
  
    const personRef = doc(db, 'person', ids.person);

    await updateDoc(personRef, person);

    const representative = await mapRepresentative(values, personRef);

    const representativeRef = doc(db, 'representative', ids.representative)
    await updateDoc(representativeRef, representative);
    revalidatePath('/cadastros')
  } catch (error) {
    console.log(error);
  }
}

export async function deleteDocs(ids: { [key: string]: string }) {
  try {
    for (const [key, value] of Object.entries(ids)) {
      await deleteDoc(doc(db,key,value));
    }
  } catch (error) {
    console.log(error)
  }
}