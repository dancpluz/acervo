import { useEffect, useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { collection, FirestoreDataConverter } from 'firebase/firestore';
import db from '@/lib/firebase';

export default function useGetEntities<EntityT>(
  entity: string,
  converter: FirestoreDataConverter<EntityT>,
) {
  const [resolvedEntities, setResolvedEntities] = useState<EntityT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const pathSegments = entity.split(',').map(segment => segment.trim());

  const collectionRef = collection(db, ...pathSegments as [string]).withConverter(converter);

  const [snapshots, firebaseLoading, firebaseError] = useCollectionData(collectionRef);

  useEffect(() => {
    if (snapshots && snapshots.length > 0) {
      const resolveCollaborators = async () => {
        try {
          const resolvedData = await Promise.all(snapshots);
          setResolvedEntities(resolvedData);
          setLoading(false);
        } catch (err) {
          setError(err);
          setLoading(false);
        }
      };

      resolveCollaborators();
    } else {
      setLoading(firebaseLoading);
    }
  }, [snapshots, firebaseLoading]);
  
  return [
    resolvedEntities,
    loading || firebaseLoading,
    error || firebaseError,
  ]
};