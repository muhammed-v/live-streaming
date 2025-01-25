// for the messages collection/model at MongoDB 

import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        senderId:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User", // senderId will be a reference to the user model(since sender is a user)
            required:true
        },
        receiverId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        text:{
            type:String
        },
        image: {
            type: String
        }
    },
    {timestamps: true}
);

const Message = mongoose.model("Message",messageSchema); 

export default Message;// we're exporting it so we can use it in different files in our application