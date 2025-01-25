import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

export const protectRoute= async (req,res,next)=>{//nex calls the next func.after protectRoute
    try {
        const token= req.cookies.jwt; // jwt is used since we named our token as jwt while creating ... To grab token from cookies, we use cookie parser package
        if(!token){//if no token provided
            return res.status(401).json({message: "Unauthorized - No Token Provided"});
        }
        const decoded= jwt.verify(token,process.env.JWT_SECRET) // we used private key JWT_SECRET to create the token, therefore for decoding also, we use the same key.

        if (!decoded){ // if decoded value is false
            return res.status(401).json({message: "Unauthorized - Invalid Token"});
        } 

        const user = await User.findById(decoded.userId).select("-password"); //we decode and grab the userId since that's what we put into the token as payload //-passsword-> we don't want to extract the password

        if(!user){//if user not found.(this will most prolly not be called, but still good to have)
            return res.status(404).json({message:"User not found"});
        }

        //if you reach here, it means the user is authenticated.
        req.user=user;
        next();

    } catch (error) {
        console.log("Error in protectRoute middleware: ",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}