import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsersForSidebar = async (req,res)=>{
    try {
        const loggedInUserId= req.user._id; //we're able to do this due to the usage of protectRoute
        const filteredUsers = await User.find({_id:{$ne:loggedInUserId}}).select("-password"); //tells mongoose to find all users except the current logged in user

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error in getUsersForSidebar ",error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
};

export const getMessages =async(req,res)=>{
    try {
        const {id: userToChatId}= req.params; //fetch id from /:id and rename it to userToChatId
        const myId= req.user._id;

        const messages = await Message.find({
            $or:[
                {senderId:myId,receiverId:userToChatId},
                {senderId:userToChatId,receiverId:myId}
            ]
        });
        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller",error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
};

export const sendMessage =async(req,res)=>{
    //the message could either be a text or an image
    try {
        const {text,image}= req.body;
        const {id: receiverId}= req.params;
        const senderId = req.user._id;

        let imageUrl; //variable
        if(image){
            //Upload base64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image); //uploads image and gives a response
            imageUrl = uploadResponse.secure_url;
        }

        // now create a new message and save it to the DB
         const newMessage= new Message({
            senderId,receiverId,text, image: imageUrl
         });
         await newMessage.save();

         //socket.io shit coming here
        
         res.status(201).json(newMessage);

    } catch (error) {
        console.log("Error in sendMessage controller",error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
};