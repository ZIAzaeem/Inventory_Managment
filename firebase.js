// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { Firestore, getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAHAq2pOyAQN-AX-erVmTkfcDLUKPyb-HI",
  authDomain: "inventory-management-9f733.firebaseapp.com",
  projectId: "inventory-management-9f733",
  storageBucket: "inventory-management-9f733.appspot.com",
  messagingSenderId: "757883881453",
  appId: "1:757883881453:web:5b540ceff69d6f3c8489e4",
  measurementId: "G-NP2NGQ86MD"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}