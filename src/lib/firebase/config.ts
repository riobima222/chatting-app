import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB5lGvftAeo9weHztjIaRf0aQDMi4O66xw",
  authDomain: "web990-d571d.firebaseapp.com",
  projectId: "web990-d571d",
  storageBucket: "web990-d571d.appspot.com",
  messagingSenderId: "220591760665",
  appId: "1:220591760665:web:115eb926f5c6b85abf9188",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
