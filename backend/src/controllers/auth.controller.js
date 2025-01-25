
import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utilities.js"; //importing using curly braces since we export without default in utilities.js
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';

export const signup= async(req,res)=>{
    //res.send("signup route");
    const {fullName,email,password} = req.body;
    try {
        if(!fullName || !email ||!password){
            return res.status(400).json({message:"All fields are required!"});
        }
        if(password.length <8){
            return res.status(400).json({message:"Password must be at least 8 characters"}); //400-> error message
        }

        const user= await User.findOne({email}) //checking whether the user exists vis the email
        if(user) return res.status(400).json({message:"Email already exists"});

        // hash passwords using bcrypt js package
        const salt = await bcrypt.genSalt(10) //10->generally used convention
        const hashedPass = await bcrypt.hash(password,salt);

        const newUser= new User({
            fullName, //fullName:fullName ->fullName(shortening)
            email,
            password:hashedPass
        })

        if(newUser){
            //after creating user, generate JWT token, send the token back in the cookies to the user. success-> take to home page
             generateToken(newUser._id,res); //_id -> the way mongoDB stores it //res-> so that it can send the cookie in the respnse
             await newUser.save(); //save the user to the database

             res.status(201).json({//201->something has been created //sending a success message
                _id: newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                profilePic:newUser.profilePic,
             });  
        } else {
            return res.status(400).json({message:"Invalid user data"});
        }
    } catch (error) {
        console.log("Error in signup controller",error.message);
        res.status(500).json({message:"Internal Server Error"}); //500-> server side error
    }
};

export const login= async(req,res)=>{
    //res.send("login route");
    const {email,password} = req.body;
    try {
        const user= await User.findOne({email});
        if(!user) return res.status(400).json({message:"Invalid credentials"});

        const isPassCorrect= await bcrypt.compare(password,user.password);

        if(!isPassCorrect) {
            return res.status(400).json({message:"Invalid credentials"});
        }

        generateToken(user._id,res);
        res.status(200).json({ //200-> a request to a server was successful
            _id: user._id,
                fullName:user.fullName,
                email:user.email,
                profilePic:user.profilePic,
        });
    } catch (error) {
        console.log("Error in login controller",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
};

export const logout=(req,res)=>{
    //res.send("logout route");
    //when a user is logging out, we have to clear the cookies.
    try {
        res.cookie("jwt","",{maxAge:0}) //maxage=0->expires immediately
        res.status(200).json({message:"Logged out successfully"});
    } catch (error) {
        console.log("Error in logout controller",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
};

export const updateProfile = async(req,res)=>{ // for this, we need a service to which we can upload our photos into->cloudinary
    try {
        const {profilePic}= req.body; //grab profile pic from req.body
        const userId= req.user._id; //req.user is initialized in protectRoute. This is the next() of protectRoute

        if(!profilePic){
            return res.status(400).json({message:"Profile pic is required"});
        }

        const uploadResponse= await cloudinary.uploader.upload(profilePic);
        //now update the user in the database(cloudinary is just a bucket for our images. It is is not our database)
        const updatedUser = await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true})// secure_url is a field that cloudinary gives you back //By default, findOneAndUpdate() returns the document as it was before update was applied. If you set new: true, findOneAndUpdate() will instead give you the object after update was applied.

        res.status(200).json(updatedUser);

    } catch (error) {
        console.log("Error in update-profile:",error);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export const checkAuth = (req,res)=>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}