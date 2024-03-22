import * as v2 from "firebase-functions/v2";

type INdexible = {[key:string]:any}

export const helloworld = v2.https.onRequest((request,response)=>{
    
    const name  = request.params[0].replace('/','');
    const items:INdexible = {lamp:"lamp text",chair:"chair text"};
    const message = items[name];

    response.send(`<h1> ${message} </h1>`)
})




