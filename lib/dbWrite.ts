'use server'

import db from "@/lib/firebase";
import { collection, addDoc, deleteDoc, updateDoc, doc, serverTimestamp, getCountFromServer, query, where } from "firebase/firestore";
import { revalidatePath } from 'next/cache';

export async function addEntity(values: any, entity: string, entityValue?: string) {
  try {
    const personRef = await addDoc(collection(db, "person"), values.person);
    
    delete values.person
    
    if (entityValue) {
      values[entityValue] = values[entityValue] ? doc(db, entityValue, values[entityValue]) : ''
    }
    
    await addDoc(collection(db, entity), { ...values, person: personRef, last_updated: serverTimestamp() });    
  } catch (error) {
    console.log(error);
    throw new Error('Erro ao adicionar no banco de dados')
  }
}

export async function updateEntity(values: any, entity: string, refs: { [key: string]: string }, entityValue?: string) {
  try {
    const personRef = doc(db, 'person', refs.person);
    
    await updateDoc(personRef, values.person);
    
    delete values.person
    
    if (entityValue) {
      values[entityValue] = values[entityValue] ? doc(db, entityValue, values[entityValue]) : ''
    }
    
    const entityRef = doc(db, entity, refs[entity])
    
    await updateDoc(entityRef, { ...values, last_updated: serverTimestamp() });
    
    revalidatePath('/cadastros')
    
  } catch (error) {
    console.log(error);
    throw new Error('Erro ao atualizar no banco de dados')
  }
}

export async function deleteEntity(entity: string, ref: string) {
  try {
    await deleteDoc(doc(db, entity, ref));
  } catch (error) {
    console.log(error)
    throw new Error('Erro ao deletar no banco de dados')
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

export async function updateIndex(shardId: string, num: number) {
  try {
    const shardRef = doc(db, 'shard', shardId);
    await updateDoc(shardRef, { index: num })
  } catch(error) {
    console.log(error)
  }
}

export async function getCountStatus(col: string, status?: string) {
  try {
    const colReference = collection(db, col);
    const q = status ? query(colReference, where('status', '==', status)) : colReference;
    const snapshot = await getCountFromServer(q);
    const count = snapshot.data().count;
    return count;
  } catch (error) {
    console.log(error)
    return 0
  }
}