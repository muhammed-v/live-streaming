import mongoose from 'mongoose'; //use this package to connect and interact with our database

export const connectDB= async ()=>{ // creating an async function connectDB. async is necessary to use await
    try {
        const conn= await mongoose.connect(process.env.MONGODB_URI);// connecting db. await-> since it might take some time. this will not block other processes
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.log("MongoDB connection error:",error);
    }
};