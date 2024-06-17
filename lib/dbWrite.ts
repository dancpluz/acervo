'use server'

import db from "@/lib/firebase";
import { collection, addDoc, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { mapPerson, mapFactory, mapRepresentative, mapOffice, mapClient, mapCollaborator, mapService } from "@/lib/map"
import { revalidatePath } from 'next/cache';

export async function addFactory(values: any) {
  // Add a new factory to the database
  try {
    const representativeRef = values.representative ? doc(db, 'person', values.representative.ref) : ''

    const person = await mapPerson(values, 'Jurídica');
  
    const personRef = await addDoc(collection(db, "person"), person);

    const factory = await mapFactory({ ...values, representative: representativeRef }, personRef);
  
    await addDoc(collection(db, "factory"), factory);
    revalidatePath('/cadastros')
  } catch (error) {
    console.log(error);
    throw new Error('Ocorreu um erro inesperado');
  }
}

export async function updateFactory(ids: { [key: string]: string }, values: any) {
  // Update a factory to the database
  try {
    const representativeRef = values.representative ? doc(db, 'person', values.representative.ref) : ''

    const person = await mapPerson(values, 'Jurídica');
  
    const personRef = doc(db, 'person', ids.person);

    await updateDoc(personRef, person);

    const factory = await mapFactory({ ...values, representative: representativeRef }, personRef);

    const factoryRef = doc(db, 'factory', ids.factory)
    await updateDoc(factoryRef, factory);
    revalidatePath('/cadastros')
  } catch (error) {
    console.log(error);
    throw new Error('Ocorreu um erro inesperado');
  }
}

export async function addRepresentative(values: any) {
  // Add a new representative to the database
  try {
    const person = await mapPerson(values, 'Jurídica');
  
    const personRef = await addDoc(collection(db, "person"), person);

    const representative = await mapRepresentative(values, personRef);
  
    await addDoc(collection(db, "representative"), representative);
    revalidatePath('/cadastros')
  } catch (error) {
    console.log(error);
    throw new Error('Ocorreu um erro inesperado');
  }
}

export async function updateRepresentative(ids: { [key: string]: string }, values: any) {
  // Update a representative to the database
  try {
    const person = await mapPerson(values, 'Jurídica');
  
    const personRef = doc(db, 'person', ids.person);

    await updateDoc(personRef, person);

    const representative = await mapRepresentative(values, personRef);

    const representativeRef = doc(db, 'representative', ids.representative)
    await updateDoc(representativeRef, representative);
    revalidatePath('/cadastros')
  } catch (error) {
    console.log(error);
    throw new Error('Ocorreu um erro inesperado');
  }
}

export async function addOffice(values: any) {
  // Add a new office to the database
  try {
    const person = await mapPerson(values, 'Jurídica');

    const personRef = await addDoc(collection(db, "person"), person);

    const office = await mapOffice(values, personRef);

    await addDoc(collection(db, "office"), office);
    revalidatePath('/cadastros')
  } catch (error) {
    console.log(error);
    throw new Error('Ocorreu um erro inesperado');
  }
}

export async function updateOffice(ids: { [key: string]: string }, values: any) {
  // Update a office to the database
  try {
    const person = await mapPerson(values, 'Jurídica');

    const personRef = doc(db, 'person', ids.person);

    await updateDoc(personRef, person);

    const office = await mapOffice(values, personRef);

    const officeRef = doc(db, 'office', ids.office)
    await updateDoc(officeRef, office);
    revalidatePath('/cadastros')
  } catch (error) {
    console.log(error);
    throw new Error('Ocorreu um erro inesperado');
  }
}

export async function addClient(values: any, personType: string) {
  // Add a new client to the database
  try {
    const person = await mapPerson(values, personType);

    const personRef = await addDoc(collection(db, "person"), person);
    
    const client = await mapClient(values, personRef);

    await addDoc(collection(db, "client"), client);
    revalidatePath('/cadastros')
  } catch (error) {
    console.log(error);
    throw new Error('Ocorreu um erro inesperado');
  }
}

export async function updateClient(ids: { [key: string]: string }, values: any, personType: string) {
  // Update a client to the database
  try {
    const person = await mapPerson(values, personType);

    const personRef = doc(db, 'person', ids.person);

    await updateDoc(personRef, person);

    const client = await mapClient(values, personRef);

    const clientRef = doc(db, 'client', ids.client)
    await updateDoc(clientRef, client);
    revalidatePath('/cadastros')
  } catch (error) {
    console.log(error);
    throw new Error('Ocorreu um erro inesperado');
  }
}

export async function addCollaborator(values: any) {
  // Add a new collaborator to the database
  try {
    const person = await mapPerson(values, 'Física');

    const personRef = await addDoc(collection(db, "person"), person);

    const collaborator = await mapCollaborator(values, personRef);

    await addDoc(collection(db, "collaborator"), collaborator);
    revalidatePath('/cadastros')
  } catch (error) {
    console.log(error);
    throw new Error('Ocorreu um erro inesperado');
  }
}

export async function updateCollaborator(ids: { [key: string]: string }, values: any) {
  // Update a collaborator to the database
  try {
    const person = await mapPerson(values, 'Física');

    const personRef = doc(db, 'person', ids.person);

    await updateDoc(personRef, person);

    const collaborator = await mapCollaborator(values, personRef);

    const collaboratorRef = doc(db, 'collaborator', ids.collaborator)
    await updateDoc(collaboratorRef, collaborator);
    revalidatePath('/cadastros')
  } catch (error) {
    console.log(error);
    throw new Error('Ocorreu um erro inesperado');
  }
}

export async function addService(values: any, personType: string) {
  // Add a new service to the database
  try {
    const person = await mapPerson(values, personType);

    const personRef = await addDoc(collection(db, "person"), person);

    const service = await mapService(values, personRef);

    await addDoc(collection(db, "service"), service);
    revalidatePath('/cadastros')
  } catch (error) {
    console.log(error);
    throw new Error('Ocorreu um erro inesperado');
  }
}

export async function updateService(ids: { [key: string]: string }, values: any, personType: string) {
  // Update a service to the database
  try {
    const person = await mapPerson(values, personType);

    const personRef = doc(db, 'person', ids.person);

    await updateDoc(personRef, person);

    const service = await mapService(values, personRef);

    const serviceRef = doc(db, 'service', ids.service)
    await updateDoc(serviceRef, service);
    revalidatePath('/cadastros')
  } catch (error) {
    console.log(error);
    throw new Error('Ocorreu um erro inesperado');
  }
}

export async function addConfig(value: any, subcollection: string) {
  // Add a new service to the database
  try {
    await addDoc(collection(db, "config", "PtwUlMicmRBxL9Noe8K1", subcollection), value);

    revalidatePath('/configuracoes')
  } catch (error) {
    console.log(error);
    throw new Error('Ocorreu um erro inesperado');
  }
}

export async function updateConfig(value: any, subcollection: string) {
  // Add a new service to the database
  try {
    await updateDoc(doc(db, 'config', 'PtwUlMicmRBxL9Noe8K1', subcollection, value.ref), value);

    revalidatePath('/configuracoes')
  } catch (error) {
    console.log(error);
    throw new Error('Ocorreu um erro inesperado');
  }
}

export async function deleteConfig(ref: string, subcollection: string) {
  try {
    await deleteDoc(doc(db, 'config', 'PtwUlMicmRBxL9Noe8K1', subcollection, ref))
  } catch (error) {
    console.log(error)
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