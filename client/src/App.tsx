import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import { db, auth } from "./firebase-config.js";
import {
  addDoc,
  collection,
  setDoc,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

function App() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [users, setUsers] = useState<any[]>([]);
  const [singleUser, setSingleUser] = useState<any>(null);
  const [updatedName, setUpdatedName] = useState<string>(""); 
  const usersCollectionRef = collection(db, "Users");
  const userById = doc(db, "Users", "IPo8bSmhTyO1TmTczW5Z");

  const getusers = async () => {
    const data = await getDocs(usersCollectionRef);
    const usersList = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    console.log("users old method",usersList);
    setUsers(usersList);
    //console.log("data", usersList);
    

    
  };

  useEffect(() => {
  
    getusers();

    
  },[])

  const getByUserId = async () => {
    const data = await getDoc(userById);
    if (data.exists()) {
      const userData = data.data();
      //console.log("User data:", userData);
      setSingleUser(userData);
    } else {
      console.log("No such document!");
    }
  };
  getByUserId();

  const createTaskHandler = async()  =>{
    const cretedTaskResponse = await fetch("https://us-central1-curry-king-test-project.cloudfunctions.net/saveCollection",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({

        date:"2024-03-25",
        task_description:"test task from client",
        task_status:false,
        userID:"test id"
        
      
      })
    })

    console.log("createtask Response",cretedTaskResponse);
  }

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nameToValidate = name;
    try {
      const response = await fetch(
        `https://validatename-j3pqakbyaq-uc.a.run.app?name=${nameToValidate}` 
          
      );
      const data = await response.json();
      console.log("response",response)

      if (data.isValid) {
        try {
          const newUserRef = await addDoc(collection(db, "Users"), {
            name,
            email,
          });

          getusers();
          
          console.log("Document written with ID: ", newUserRef.id);
        } catch (error) {
          console.error("Error saving name and email to Firestore:", error);
        }
      } else {
        alert("Invalid Name. Name Cannot have numbers");
      }
    } catch (error) {
      console.error("Error validating name:", error);
      alert("Network Error");
    }
  };
  const updateCurrentUser = async () => { 
      const response = await fetch("", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({})
      });   
      console.log("Updated Name",response)
  };
  
  return (
    <div className="App">
      <button onClick={handleGoogleSignIn}>Sign in with Google</button>
      <div>
        <br />
        <form onSubmit={handleSubmit}>
          <label>Name:</label>
          <input
            type="text"
            id="name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label>Email:</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit">Save</button>
        </form>
        <div>
          <h1>All Users</h1>
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                <div>Name: {user.name}</div>
                <div>Email: {user.email}</div>
                <br />
              </li>
            ))}
          </ul>
          <h1>Get A Single User</h1>
          <h4>
            {" "}
            {singleUser && (
              <div>
                <p>Name: {singleUser.name}</p>
                <p>Email: {singleUser.email}</p>
              </div>
            )}
            <div>
            <input
                  type="text"
                  value={updatedName}
                  onChange={(e) => setUpdatedName(e.target.value)}
                />
                <button onClick={updateCurrentUser}>Update Name</button>
            </div>
          </h4>
      
        </div>
      </div>
    </div>
  );
}

export default App;
