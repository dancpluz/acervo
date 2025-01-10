import { useEffect, useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { collection, or, FirestoreDataConverter, getCountFromServer, query, where, QueryFieldFilterConstraint } from 'firebase/firestore';
import db from '@/lib/firebase';
import { FilterKeys, filters } from '@/lib/filters';
import { useSearchParams } from 'next/navigation'

// MUITO MAL OTIMIZADO

async function resolvePromisesDeep(obj: any): Promise<any> {
  if (obj instanceof Promise) {
    // If obj is a promise, resolve it
    return await obj;
  } else if (Array.isArray(obj)) {
    // If obj is an array, map over it and resolve any promises inside
    return await Promise.all(obj.map(resolvePromisesDeep));
  } else if (obj !== null && typeof obj === 'object') {
    // If obj is an object, recursively resolve any promises in its values
    const entries = Object.entries(obj);
    const resolvedEntries = await Promise.all(
      entries.map(async ([key, value]) => [key, await resolvePromisesDeep(value)])
    );
    return Object.fromEntries(resolvedEntries);
  }
  // Return the value directly if it's not a promise, array, or object
  return obj;
}

export default function useGetEntities<EntityT>(
  entity: string,
  converter: FirestoreDataConverter<EntityT>,
  filterKeys: FilterKeys[] = []
) {
  const [resolvedEntities, setResolvedEntities] = useState<EntityT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [count, setCount] = useState<number>(0);

  const pathSegments = entity.split(',').map(segment => segment.trim());

  const collectionRef = collection(db, ...pathSegments as [string]).withConverter(converter);

  const searchParams = useSearchParams()
  const querySegments = filterKeys.reduce<QueryFieldFilterConstraint[]>((acc, key) => {
    const { param } = filters[key];
    if (param && searchParams.has(param)) {
      acc.push(where(key, '==', searchParams.get(param)));
    }
    return acc;
  }, []);

  const q = querySegments.length > 0 && filterKeys.length > 0 ? query(collectionRef, or(
    ...querySegments
  )) : collectionRef;

  const [snapshots, firebaseLoading, firebaseError] = useCollectionData(q);

  useEffect(() => {
    const getCount = async () => {
      try {
        const snapshot = await getCountFromServer(collectionRef);
        const count = snapshot.data().count;
        setCount(count);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    getCount();    

    if (snapshots) {
      const resolveEntities = async () => {
        try {
          const resolvedSnapshots = await Promise.all(snapshots);
          const resolvedData = await Promise.all(
            resolvedSnapshots.map(snapshot => resolvePromisesDeep(snapshot))
          );
          setResolvedEntities(resolvedData);
          setLoading(false);
        } catch (err) {
          setError(err);
          setLoading(false);
        }
      };

      resolveEntities();
    } else {
      setLoading(firebaseLoading);
    }
  }, [snapshots, firebaseLoading, searchParams]);
  
  return [
    resolvedEntities,
    loading || firebaseLoading,
    error || firebaseError,
    count
  ]
};