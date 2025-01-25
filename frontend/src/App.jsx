
import Navbar from "./components/Navbar";
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import StreamPage from "./pages/StreamPage"

import { Routes, Route, Navigate } from "react-router-dom";// Route to give specific routes
import { axiosInstance } from "./lib/axios";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import {Loader} from 'lucide-react' //lucide for icons
import {Toaster} from 'react-hot-toast' //react hot toast for notifications


const App =()=>{

  const {authUser,checkAuth,isCheckingAuth}= useAuthStore(); //grabbing states from useAuthStore

  useEffect(()=>{ //as soon as our application starts, we call the checkAuth function
    checkAuth();
  },[checkAuth]); 

  console.log({authUser});

  if(isCheckingAuth && !authUser) return ( //for the loading screen while auth checks

    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin" />
    </div>

  )

  return (
    <div >
    <Navbar /> {/* at the top of every page we'll have a navbar component */}

    <Routes>
      <Route path="/" element={authUser? <HomePage />: <Navigate to="/login" />} /> {/*user authenticated? go to homepage else go to login page // Navigate->from react router dom */}
      <Route path="/signup" element={!authUser?<SignUpPage />:<Navigate to="/" />} /> {/* if we go to /signup, we would like to see the Signuppage component */}
      <Route path="/start-stream" element={authUser ? <StreamPage></StreamPage> : <Navigate to="/login" />}></Route>
      <Route path="/login" element={!authUser?<LoginPage />:<Navigate to="/" />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/profile" element={authUser? <ProfilePage />:<Navigate to="/login" />} />
    </Routes>

    <Toaster />

    </div>
  )
};

export default App;