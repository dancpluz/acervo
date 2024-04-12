import db from "@/lib/firebase";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { Factory as type } from "@/lib/types";

function fetchFactory(query?: string) {
  //const q = query(collection(db, "cities"), where("capital", "==", true));
}

export default async function Cadastros() {
  // const docRef = await addDoc(collection(db, "person"), {
  //   name: "Tokyo",
  //   country: "Japan"
  // });
  // console.log("Document written with ID: ", docRef.id);

  return (
    <div>Cadastros</div>
  )
}
