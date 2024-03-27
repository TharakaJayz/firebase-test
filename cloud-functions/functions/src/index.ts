import * as v2 from "firebase-functions/v2";
import * as v1 from "firebase-functions/v1";
import { onDocumentUpdated } from "firebase-functions/v2/firestore";
const admin = require('firebase-admin');

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

  exports.updateName = onDocumentUpdated('Users/{userId}', async (event:any) => {
    const data = event.data.after.data();
    const previousData = event.data.before.data();
    const userId = event.params.userId;
    if (data.name !== previousData.name) {
        try {
            await firestore.collection('Users').doc(userId).update({
              name: data
            });
          console.log('Name updated successfully:', data);
        } catch (error) {
          console.error('Error updating name:', error);
        }
    }
  });


type taskData = {date:Date,task_description:string,task_status:boolean,userID:string}
  export const newTask = v1.firestore.document('/tasks/{sku}').onCreate(snapshot =>{
    
    
    const regex = /\d/;
    let data = snapshot.data() as taskData;
    console.log("new task data",snapshot.data());
    let newDescription = "";
  
    if(regex.test(data.task_description)){
      
      newDescription = "without numbers";
      return newDescription
    }
    
   return snapshot.ref.set(data);
  })

  