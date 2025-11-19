import Pusher from 'pusher'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER || "ap2",
    useTLS: true
  });

  //pusher config for realtime database  {posts is the mongodb collection name use as it is}
const db = mongoose.connection

db.once('open',()=>{
    console.log("DB Connected");

    const postCollection = db.collection("posts")
    const changeStream = postCollection.watch()

    changeStream.on('change',(change)=>{
        console.log(change);

        if (change.operationType === "insert") {
            
            console.log("Triggering Pusher")
            pusher.trigger("posts","inserted",{
                change: change
            })
        }
        else{
            console.log("Error in triggering Pusher");
        }
    })
    const messageCollection = db.collection("messages")
    const changeStreamForMessage = messageCollection.watch()

    changeStreamForMessage.on('change',(change)=>{
        console.log(change);

        if (change.operationType === "insert") {
            
            console.log("Triggering Pusher")
            pusher.trigger("messages","inserted",{
                change: change
            })
        }
        else{
            console.log("Error in triggering Pusher");
        }
    })

})