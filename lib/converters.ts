import db from "@/lib/firebase";
import { FirestoreDataConverter, WithFieldValue, DocumentData, QueryDocumentSnapshot, serverTimestamp, getDoc, SnapshotOptions, doc } from "firebase/firestore";
import { ClientT, CollaboratorT, FactoryT, FreightT, MarkupT, OfficeT, PersonT, ProposalT, ProspectionT, RepresentativeT, ServiceT } from "@/lib/types";
import { formatPercent } from '@/lib/utils';

const personConverter: FirestoreDataConverter<PersonT> = {
  toFirestore(person: WithFieldValue<PersonT>): DocumentData {
    return {
      contact: person.contact,
      info: person.info,
      payment: person.payment,
      observations: person.observations,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): PersonT {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      label: data.info.company_name ? data.info.company_name : `${data.info.name} ${data.info.surname}`,
      contact: data.contact,
      info: data.info,
      payment: data.payment,
      observations: data.observations,
    };
  },
};

const collaboratorConverter: FirestoreDataConverter<CollaboratorT> = {
  toFirestore(collaborator: WithFieldValue<CollaboratorT>): DocumentData {
    return {
      person: collaborator.person,
      role: collaborator.role,
      last_updated: collaborator.last_updated,
    };
  },
  // @ts-ignore because its async
  async fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Promise<CollaboratorT> {
    const data = snapshot.data(options);
    const person = await getDoc(data.person.withConverter(personConverter))
    return {
      id: snapshot.id,
      person: person.data() as PersonT,
      role: data.role,
      last_updated: data.last_updated.toDate(),
    };
  },
};

const representativeConverter: FirestoreDataConverter<RepresentativeT> = {
  toFirestore(representative: WithFieldValue<RepresentativeT>): DocumentData {
    return {
      person: representative.person,
      team: representative.team,
      last_updated: representative.last_updated,
    };
  },
  // @ts-ignore because its async
  async fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Promise<RepresentativeT> {
    const data = snapshot.data(options);
    const person = await getDoc(data.person.withConverter(personConverter))
    return {
      id: snapshot.id,
      person: person.data() as PersonT,
      team: data.team,
      last_updated: data.last_updated.toDate(),
    };
  },
};

const factoryConverter: FirestoreDataConverter<FactoryT> = {
  toFirestore(factory: WithFieldValue<FactoryT>): DocumentData {
    return {
      person: factory.person,
      representative: factory.representative,
      pricing: factory.pricing,
      ambient: factory.ambient,
      style: factory.style,
      direct_sale: factory.direct_sale,
      discount: factory.discount,
      link_table: factory.link_table,
      link_catalog: factory.link_catalog,
      link_site: factory.link_site,
      last_updated: factory.last_updated,
    };
  },
  // @ts-ignore because its async
  async fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Promise<FactoryT> {
    const data = snapshot.data(options);
    const person = await getDoc(data.person.withConverter(personConverter));
    const representative = data.representative ? await getDoc(data.representative.withConverter(representativeConverter)) : '';
    return {
      id: snapshot.id,
      person: person.data() as PersonT,
      representative: representative ? representative.data() as RepresentativeT : '',
      pricing: data.pricing,
      ambient: data.ambient,
      style: data.style,
      direct_sale: data.direct_sale,
      discount: data.discount,
      link_table: data.link_table,
      link_catalog: data.link_catalog,
      link_site: data.link_site,
      last_updated: data.last_updated.toDate(),
    };
  },
};

const officeConverter: FirestoreDataConverter<OfficeT> = {
  toFirestore(office: WithFieldValue<OfficeT>): DocumentData {
    return {
      person: office.person,
      team: office.team,
      last_updated: office.last_updated,
    };
  },
  // @ts-ignore because its async
  async fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Promise<OfficeT> {
    const data = snapshot.data(options);
    const person = await getDoc(data.person.withConverter(personConverter))
    return {
      id: snapshot.id,
      person: person.data() as PersonT,
      team: data.team,
      last_updated: data.last_updated.toDate(),
    };
  },
};

const clientConverter: FirestoreDataConverter<ClientT> = {
  toFirestore(client: WithFieldValue<ClientT>): DocumentData {
    return {
      person: client.person,
      office: client.office,
      order: client.order,
      last_updated: client.last_updated,
    };
  },
  // @ts-ignore because its async
  async fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Promise<ClientT> {
    const data = snapshot.data(options);
    const person = await getDoc(data.person.withConverter(personConverter))
    const office = data.office ? await getDoc(data.office.withConverter(officeConverter)) : ''
    return {
      id: snapshot.id,
      person: person.data() as PersonT,
      office: office ? office.data() as OfficeT : '',
      order: data.order,
      last_updated: data.last_updated,
    };
  },
};

const serviceConverter: FirestoreDataConverter<ServiceT> = {
  toFirestore(service: WithFieldValue<ServiceT>): DocumentData {
    return {
      person: service.person,
      service: service.service,
      last_updated: service.last_updated,
    };
  },
  // @ts-ignore because its async
  async fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Promise<ServiceT> {
    const data = snapshot.data(options);
    const person = await getDoc(data.person.withConverter(personConverter))
    return {
      id: snapshot.id,
      person: person.data() as PersonT,
      service: data.service,
      last_updated: data.last_updated.toDate(),
    };
  },
};

const markupConverter: FirestoreDataConverter<MarkupT> = {
  toFirestore(markup: WithFieldValue<MarkupT>): DocumentData {
    return {
      name: markup.name,
      observation: markup.observation,
      '12x': markup['12x'],
      '6x': markup['6x'],
      cash: markup.cash,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): MarkupT {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name,
      observation: data.observation,
      '12x': data['12x'].toString().replace('.', ','),
      '6x': formatPercent(data['6x'] as number).replace('%', ''),
      cash: formatPercent(data.cash as number).replace('%',''),
    };
  },
};

const freightConverter: FirestoreDataConverter<FreightT> = {
  toFirestore(freight: WithFieldValue<FreightT>): DocumentData {
    return {
      region: freight.region,
      fee: freight.fee,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): FreightT {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      region: data.region,
      fee: data.fee === 0 ? '' : formatPercent(data.fee as number).replace('%', ''),
    };
  },
};

const prospectionConverter: FirestoreDataConverter<ProspectionT> = {
  toFirestore(prospection: WithFieldValue<ProspectionT>): DocumentData {
    return {
      title: prospection.title,
      tax: prospection.tax,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): ProspectionT {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      title: data.title,
      tax: data.tax === 0 ? '' : formatPercent(data.tax as number).replace('%', ''),
    };
  },
};

const proposalConverter: FirestoreDataConverter<ProposalT> = {
  toFirestore(proposal: WithFieldValue<ProposalT>): DocumentData {
    return {
      num: proposal.num,
      name: proposal.name,
      priority: proposal.priority,
      status: proposal.status,
      collaborator: doc(db, 'collaborator', proposal.collaborator as string),
      client: doc(db, 'client', proposal.client as string),
      office: doc(db, 'office', proposal.office as string),
      client_type: proposal.client_type,
      project_type: proposal.project_type,
      origin: proposal.origin,
      observations: proposal.observations,
      actions: proposal.actions,
      products: proposal.products ? proposal.products : [],
      total: proposal.total ? proposal.total : 0,
      last_updated: serverTimestamp(),
      created_at: proposal.created_at ? proposal.created_at : serverTimestamp(),
    };
  },
  // @ts-ignore because its async
  async fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Promise<ProposalT> {
    const data = snapshot.data(options);
    const collaborator = data.collaborator ? await getDoc(data.collaborator.withConverter(collaboratorConverter)) : '';
    const client = data.client ? await getDoc(data.client.withConverter(clientConverter)) : '';
    const office = data.office ? await getDoc(data.office.withConverter(officeConverter)) : '';
    return {
      id: snapshot.id,
      num: data.num,
      name: data.name,
      priority: data.priority,
      status: data.status,
      collaborator: collaborator ? collaborator.data() as CollaboratorT : '',
      client: client ? client.data() as ClientT : '',
      office: office ? office.data() as OfficeT : '',
      client_type: data.client_type,
      project_type: data.project_type,
      origin: data.origin,
      observations: data.observations,
      actions: data.actions,
      products: data.products,
      total: data.total,
      last_updated: data.last_updated.toDate(),
      created_at: data.created_at.toDate(),
    };
  },
};

export const converters = {
  collaborator: collaboratorConverter,
  factory: factoryConverter,
  office: officeConverter,
  client: clientConverter,
  representative: representativeConverter,
  service: serviceConverter,
  markup: markupConverter,
  freight: freightConverter,
  prospection: prospectionConverter,
  proposal: proposalConverter,
}

export type ConverterKey = keyof typeof converters; 