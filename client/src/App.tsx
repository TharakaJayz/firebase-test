import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import {db,auth} from "./firebase-config.js"
import {collection,getDocs} from "firebase/firestore"
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

function App() {

  const usersCollectionRef = collection(db,"Users");
  useEffect( ()=>{
    const getusers = async() =>{

      const data = (await getDocs(usersCollectionRef));
      const usersList  = data.docs.map((doc) => ({...doc.data(),id:doc.id}))
      console.log("data",usersList)
    }

    getusers();
  },[])

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // Handle successful login (e.g., store user data, redirect)
      console.log(result);
    } catch (error) {
      console.error(error);
      // Handle errors (e.g., display error message)
    }
  };


 
  return (
    <div className="App">
     <button onClick={handleGoogleSignIn}>
      SIgn in
     </button>
    </div>
  );
}

export default App;
