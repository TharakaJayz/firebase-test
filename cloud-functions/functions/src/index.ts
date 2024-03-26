import * as v2 from "firebase-functions/v2";
const admin = require('firebase-admin');
import {
    onDocumentDeleted,
    onDocumentUpdated
  } from "firebase-functions/v2/firestore";

admin.initializeApp();


const firestore = admin.firestore();


export const createTask = v2.https.onRequest({cors:true},(request,response)=>{
   
    const data = request.body;
    if(data.date.length===0 || data.task_description.length===undefined || data.task_status===undefined || data.userID.length===undefined){
        return response.send(400).json({
            message:"Bad Request !"
        })
    };

    

    

    return firestore.collection('Tasks').add(data).then(()=>{return response.send(200).json({messsage:"task created succefully"})}).catch((err:any) =>{return response.status(500).json({message:"Internal server error"})})


})


exports.validateName=v2.https.onRequest({cors:true},(req,res:any)=>{
    const name:any=req.query.name;
    if (/\d/.test(name)) {
        return res.status(400).json({ error: 'Name cannot contain numbers' });
      }
   res.json({ isValid: true });
})


export const onTaskCreate = onDocumentUpdated("tas")