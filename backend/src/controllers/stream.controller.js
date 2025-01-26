import User from "../models/user.model.js"
import Stream from "../models/message.model.js"

export const addStream= async(req,res)=>{
    const viewerId= req.user_id;
    const {streamName}= req.body;
    const newStream = new Stream({
        viewerId,
        streamName
    })
    await newStream.save();
}