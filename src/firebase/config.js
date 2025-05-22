// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCXHEtwAkhZ4MAFTW9bOxD8UcyKWDDXM2Y",
  authDomain: "smartgrocery-b7433.firebaseapp.com",
  projectId: "smartgrocery-b7433",
  storageBucket: "smartgrocery-b7433.firebasestorage.app",
  messagingSenderId: "37861836179",
  appId: "1:37861836179:web:85d081770313fefbde1466"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
