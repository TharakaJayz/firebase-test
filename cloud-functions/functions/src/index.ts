import * as v2 from "firebase-functions/v2";
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

admin.initializeApp();


const firestore = admin.firestore();


export const createTask = v2.https.onRequest((request,response)=>{
    cors(request, response, () => {
    const data = request.body;
    if(data.date.length===0 || data.task_description.length===undefined || data.task_status===undefined || data.userID.length===undefined){
        return response.send(400).json({
            message:"Bad Request !"
        })
    };

    response.set('Access-Control-Allow-Origin', '*');

    

    return firestore.collection('Tasks').add(data).then(()=>{return response.send(200).json({messsage:"task created succefully"})}).catch((err:any) =>{return response.status(500).json({message:"Internal server error"})})

})
})