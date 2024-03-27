import * as v2 from "firebase-functions/v2";
import {
  onDocumentCreated,
  onDocumentDeleted,
  onDocumentUpdated,
} from "firebase-functions/v2/firestore";
const admin = require("firebase-admin");
admin.initializeApp();
const firestore = admin.firestore();

export const createTask = v2.https.onRequest(
  { cors: true },
  (request, response) => {
    const data = request.body;
    if (
      data.date.length === 0 ||
      data.task_description.length === undefined ||
      data.task_status === undefined ||
      data.userID.length === undefined
    ) {
      return response.send(400).json({
        message: "Bad Request !",
      });
    }
    return firestore
      .collection("Tasks")
      .add(data)
      .then(() => {
        return response.send(200).json({ messsage: "task created succefully" });
      })
      .catch((err: any) => {
        return response.status(500).json({ message: "Internal server error" });
      });
  }
);

exports.validateName = v2.https.onRequest({ cors: true }, (req, res: any) => {
  const name: any = req.query.name;
  if (/\d/.test(name)) {
    return res.status(400).json({ error: "Name cannot contain numbers" });
  }
  return res.json({ isValid: true });
});


exports.updateUser = onDocumentUpdated("/Users/{userId}", async(event) => {
  if (!event.data) {
    throw "";
  }
  const newValue = event.data.after.data();
  const previousValue = event.data.before.data();

  if (newValue.name !== previousValue.name
  ) {
    const userId = event.params.userId;
    let newName = newValue.name;

    if(newValue.name===""){
      newName = previousValue. name;
    }

    try {
      await firestore.collection("Users").doc(userId).update({
        name: newName,
      });
      console.log("Name updated successfully:", newName);
    } catch (error) {
      console.error("Error updating name:", error);
    }
  }
});


type taskData = {
  date: Date;
  task_description: string;
  task_status: boolean;
  userID: string;
};

export const newTaskTrigger = onDocumentCreated(
  { document: "Tasks/{taskId}" },
  async (event) => {
    const regex = /\d/;
    if (!event.data) {
      throw "";
    }
    let data = event.data.data() as taskData;
    // console.log("new task data",event.data);
    let newDescription = "";

    if (regex.test(data.task_description)) {
      newDescription = "without numbers";
      data = { ...data, task_description: newDescription };
      // console.log("new description created")
    }
    try {
      const result = await event.data.ref.set({ ...data }, { merge: true });
      console.log("result", result);
    } catch (err) {
      console.log("task updat error", err);
    }

    //  return result;
  }
);

exports.createNewUser = onDocumentCreated(
  { document: "/Users/{userid}" },
  async (event) => {
    if (!event.data) {
      throw "err";
    }
    let userToCreate = event.data.data();
    const capitalizedName = userToCreate.name
      ? userToCreate.name.charAt(0).toUpperCase() + userToCreate.name.slice(1)
      : "";

    userToCreate = { ...userToCreate, name: capitalizedName };
    try {
      const result = await event.data.ref.set(
        { ...userToCreate },
        { merge: true }
      );
      console.log("result", result);
    } catch (err) {
      console.log("task updat error", err);
    }
  }
);

// type deletedUserDataType  = {name:string,email:string};

export const userDeleteTrigger = onDocumentDeleted("Users/{userId}",async(event)=>{
  let deltedUserId = event.params.userId;
  console.log("This is deleted user id",deltedUserId.trim());

  try{
    
    // const deletedTaskQuerySnapshot = await firestore.collection("Tasks").get();
    const deletedTaskQuerySnapshot = await admin.firestore().collection("Tasks").where("userId","==","lLBMm5tjMq5PLz8KEUZV").get();

    console.log("deleted User Tasks",deletedTaskQuerySnapshot.docs.map((doc:any)=>({...doc.data(),id:doc.id})));

    // correctly getlting tasks taht related to user


  }catch(err){
    console.log("erro of getting data related to deleted user",err);
  }

 


})
