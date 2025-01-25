//route.js for convenience
//when we click sign up or login, we call this file

import express from 'express';
import { checkAuth, login, logout, signup, updateProfile } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
const router= express.Router()

// router.get("/signup",(req,res)=>{// request,response
//     res.send("signup route")
// }) // if you go to http://localhost:5001/api/auth/signup, it'll display signup route
// router.get("/login",(req,res)=>{
//     res.send("login route")
// })
// router.get("/logout",(req,res)=>{
//     res.send("logout route")
// })

// for signup and all, we usually send a post request
router.post("/signup", signup); // we use controllers to make the code streamlined
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-profile",protectRoute,updateProfile); //put method because we're updating something
// we only need to call this function for authenticated users.therefore, protectRoute function(it is a middleware)

router.get("/check",protectRoute,checkAuth); //to check if user is authenticated or not(used when the page is refreshed. if not authenticated, then take them to the login page)

export default router;