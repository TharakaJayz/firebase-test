import * as v2 from "firebase-functions/v2";
import * as admin from 'firebase-admin';
admin.initializeApp();

exports.validateName=v2.https.onRequest((req,res:any)=>{
    const name:any=req.query.name;
    if (/\d/.test(name)) {
        return res.status(400).json({ error: 'Name cannot contain numbers' });
      }
   res.json({ isValid: true });
})
