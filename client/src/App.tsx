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

  const createTaskHandler = async()  =>{
    const cretedTaskResponse = await fetch("https://createtask-j3pqakbyaq-uc.a.run.app",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({

        date:"2024-03-25",
        task_description:"test task from client",
        task_status:false,
        userID:"test id"
        
      
      })
    });

    console.log("createtask Response",cretedTaskResponse);
  }

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
   
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();
      console.log("logged user token",idToken);
      
      
   
      console.log(result);
    } catch (error) {
      console.error(error);
     
    }
  };


 
  return (
    <div className="App">
     <button onClick={handleGoogleSignIn}>
      SIgn in
     </button>
     <button onClick={createTaskHandler}>save task</button>
    </div>
  );
}

export default App;
