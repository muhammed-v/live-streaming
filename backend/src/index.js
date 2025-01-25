//const express= require("express") //importing express // type commonjs
import express from 'express'; //type module
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors'; // cors error due to backend and front end being different ports,i.e, 'http://localhost:5001/api/auth/check', http://localhost:5173'

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js"; //for local files put .js in the end since type is module
import messageRoutes from "./routes/message.route.js"; 

dotenv.config()
const app= express(); // creating an express app

const PORT= process.env.PORT // process.env to read .env content (now the port value is coming form .env file)

app.use(express.json()); //basically allows us to extract the json data from body @auth.controller.js
app.use(cookieParser()); //allows us to parse a cookie
app.use(cors({ //use curly braces, this shit is an object
    origin: "http://localhost:5173",
    credentials:true //allow the cookies or authorization headers to be sent with the request.
}));

app.use("/api/auth",authRoutes); //if user visits /api/auth, then call authRoutes
app.use("/api/message",messageRoutes);

app.listen(PORT,()=>{ //once starts listening, display the string server is runnin on PORT. to run this, create a script in scripts of package.json
    console.log(" server is runnin on PORT: "+ PORT);
    connectDB();
}); 