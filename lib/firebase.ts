import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

//import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_APIKEY,
  authDomain: "acervo-erp.firebaseapp.com",
  projectId: "acervo-erp",
  storageBucket: "acervo-erp.appspot.com",
  messagingSenderId: "214958449321",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APPID,
  measurementId: "G-YTNK6PE2BV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
//const analytics = getAnalytics(app);

