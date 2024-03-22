
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

import {getFirestore}  from "@firebase/firestore"
const firebaseConfig = {
    apiKey: "AIzaSyDAP2nciwv_IcWyzDqU3TsoLgGRuJxhwmk",
    authDomain: "curry-king-test-project.firebaseapp.com",
    projectId: "curry-king-test-project",
    storageBucket: "curry-king-test-project.appspot.com",
    messagingSenderId: "90291681239",
    appId: "1:90291681239:web:c8470a7ef1b768f506fd92",
    measurementId: "G-Y7V0F9K0Q6"
  };
  

  const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);

  export const db = getFirestore(app);