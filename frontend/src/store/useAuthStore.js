import {create} from 'zustand'// Zustand is a global state management library. Eg:authenticated user state, etc...
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';


//A store is created using the create function from Zustand. The store contains your state and any functions to update it.
export const useAuthStore = create((set)=>({// first argument is a callback function where we would like to return an object and this object will be our initial state
    authUser: null, //checking whether the user is authenticated or not
    isSigningUp: false,//loading state
    isLoggingIn: false,
    isUpdatingProfile: false,

    isCheckingAuth: true,//loading state for authUser //initially true since as soon as we refresh, we will check  if the user is authenticated or not
    // while checking, we can show a loading spinner on the screen
    checkAuth: async()=>{//checking if authenticated or not. we already have an endpoint for this in backend
        try {
            const res = await axiosInstance.get("/auth/check");

            set({authUser:res.data});//seting authUser state to res.data
        } catch (error) {
            console.log("Error in checkAuth:",error);
            set({authUser:null});
        } finally {
            set({isCheckingAuth:false});
        }
    },

    signup: async (data)=>{
        set({isSigningUp:true});
        try {
            const res= await axiosInstance.post("/auth/signup",data);
            set({authUser:res.data});
            toast.success("Account created successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        } finally{
            set({isSigningUp:false});
        }
    },

    login: async (data)=>{
        set({isLoggingIn:true});
        try {
            const res= await axiosInstance.post("/auth/login",data);
            set({authUser:res.data});
            toast.success("Logged in successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        } finally{
            set({isLoggingIn:false});
        }
    },

    logout: async ()=>{
        try {//if we want, we can add a state for this, but since logout is very quick, it'll not be necessary
            await axiosInstance.post("/auth/logout");
            set({authUser:null});
            toast.success("logged out successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }


}));