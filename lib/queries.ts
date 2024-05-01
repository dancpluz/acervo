import db from "@/lib/firebase";
import { collection, query, or, getDocs, where } from "firebase/firestore";


export async function documentExists(obj: { [key: string]: { query: string, value: string }[] }): Promise<boolean> {
  // Checks in the database if a document with the input values already exists
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
    // Handle the error here
    console.error("An error occurred while checking document existence:", error);
  }

  return exists;
}

