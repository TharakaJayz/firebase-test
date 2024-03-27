import * as v2 from "firebase-functions/v2";
import {
  onDocumentCreated,
  onDocumentUpdated,
  Change,
  FirestoreEvent,
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
  res.json({ isValid: true });
});

exports.updateUser = onDocumentUpdated("/Users/{userId}", async(event) => {
  if (!event.data) {
    throw "";
  }
  const newValue = event.data.after.data();
  const previousValue = event.data.before.data();

  if (
    newValue.name &&
    previousValue.name &&
    newValue.name !== previousValue.name
  ) {
    const userId = event.params.userId;
    const newName = newValue.name;

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

export const newTask = onDocumentCreated(
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
