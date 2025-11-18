import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAfcRcDvj5j8Y3qdbtqGRsO9yPT8CeTWsU",
  authDomain: "dining-digest.firebaseapp.com",
  projectId: "dining-digest",
  storageBucket: "dining-digest.appspot.com",   // fixed typo (.app → .appspot.com)
  messagingSenderId: "34482994899",
  appId: "1:34482994899:web:225d352a0212b5774f1e26"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize Firestore (instead of Storage)
const db = getFirestore(app);

export default db;
