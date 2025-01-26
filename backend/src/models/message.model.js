// for the messages collection/model at MongoDB 

import mongoose from "mongoose";

const streamSchema = new mongoose.Schema(
    {
        viewerId:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User", // senderId will be a reference to the user model(since sender is a user)
            required:true
        },
        // streamId:{   ///// use _id instead
        //     type:mongoose.Schema.Types.ObjectId,
        //     required:true
        // },
        streamName:{
            type:String
        }
    },
    {timestamps: true}
);

const Stream = mongoose.model("Stream",streamSchema); 

export default Stream;// we're exporting it so we can use it in different files in our application