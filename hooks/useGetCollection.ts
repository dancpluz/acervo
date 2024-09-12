// @ts-nocheck

import { collection, query, getDoc, DocumentReference } from "firebase/firestore";
import { useEffect, useCallback, useMemo, useState } from "react";
import { useCollectionData } from 'react-firebase-hooks/firestore';
import db from "@/lib/firebase";

export type CollectionT = {
  snapshot: any;
}

export default function useGetCollection(
  entity: string,
  refPaths = [
    {'collaborator': {
      'person': ''
    }},
    {'client': {
      'person': ''
    }},
    {'office': {
      'person': ''
    }},
  ],
): CollectionT {
  const [snapshots, setSnapshots] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const [firebaseSnapshots, firebaseLoading, firebaseError] = useCollectionData(query(collection(db, entity)));

  async function expandRefs(doc, path) {
    for (const [key, value] of Object.entries(path)) {
      if (!value) {
        const ref = await getDoc(doc[key])
        return { ...doc, [key]: ref.data() }
      } else {
        if (doc[key] instanceof DocumentReference) {
          const ref = await getDoc(doc[key])
          return expandRefs(ref.data(), value)
        }
        return expandRefs(doc[key], value)
        
      }
    }
  }

  const processSnapshots = useCallback(async () => {
    if (!firebaseSnapshots) return;
    try {
      if (firebaseSnapshots) {
        const expandedSnapshots = await Promise.all(firebaseSnapshots.map(async (doc) => {
          let obj = { ...doc };
          for (const path of refPaths) {
            obj[Object.keys(path)[0]] = await expandRefs(doc, path)
          }
          return obj;
        }));
        setSnapshots(expandedSnapshots);
      }
    } catch (err) {
      console.error('Error expanding references:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [firebaseSnapshots, firebaseError])

  useEffect(() => {
    setLoading(true);
    setError(null);

    if (!firebaseLoading && !firebaseError) {
      processSnapshots().finally(() => setLoading(false));
    }

    if (firebaseError) {
      setError(firebaseError);
      setLoading(false);
    }
  }, [firebaseSnapshots, firebaseError])

  const result = useMemo(() => ([
    snapshots,
    loading,
    error,
  ]), [snapshots, loading, error]);

  return result
}

// {
//   'collaborator': {
//     'person': ''
//   },
//   'client': {
//     'person': ''
//   }
//   'actions': [
//     'collaborator': {
//       'person': ''
//     }
//   ]
// }

[['collaborator', 'person'], ['client', 'person'], ['office', 'person'], ['actions', ['collaborator', 'person']]]