// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCIDenxdH3sNgGGV5xcaQUYaQvlCHRLW5M",
  authDomain: "scrimba-projects-e10ef.firebaseapp.com",
  projectId: "scrimba-projects-e10ef",
  storageBucket: "scrimba-projects-e10ef.appspot.com",
  messagingSenderId: "656700262494",
  appId: "1:656700262494:web:b368829c07e7c2b48bcccf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Collection reference
const notesCollectionRef = collection(db, "notes");

export default app;
export { db, notesCollectionRef}