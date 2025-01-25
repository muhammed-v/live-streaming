// for the users collection/model at MongoDB 

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(//the fields which a user will have
    {
        email:{
            type:String,
            required:true,
            unique: true
        },
        fullName:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true,
            minlength:8
        },
        profilePic:{
            type:String,
            default:"",//since not required
        }
    },
    {timestamps: true} //inorder to show created at and updated at
);

const User = mongoose.model("User",userSchema); //use User instead of users. Mongoose like it(will be saved as users in mongoDB)
// we created a model called User depending on the userSchema

export default User;// we're exporting it so we can use it in different files in our application