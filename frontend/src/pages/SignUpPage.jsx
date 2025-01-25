import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthImagePattern from '../components/AuthImagePattern';
import toast from 'react-hot-toast';

const SignUpPage = () => {
  const [showPassword,setShowPassword]= useState(false); //for the eye icon near password // showPassword is assigned the current state value (false initially).  setShowPassword is the function you call to update the showPassword state.
  //showPassword is managed locally using React's useState instead of being part of the Zustand store is because it represents a component-specific state, i.e, The showPassword state only affects the current form or input field where the password visibility toggle is implemented. Other parts of the app don't need to know or respond to this state.
  const [formData,setFormData] =useState({//initially the from data fields will be set to the following values.
    fullName:"",
    email:"",
    password:""
  });

  const {signup,isSigningUp} = useAuthStore(); //isSigningUp is used to freeze the sign up button, give loading icon to the button etc. when necessary.

  const validateForm =()=>{

    if(!formData.fullName.trim()) return toast.error("Full name is required"); //if fullName is not provided, print toast error message
    if(!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 8) return toast.error("Password must be at least 8 characters");

    return true;
  }; //function for validating forms(if user doesn't enter all fields, show error)

  const handleSubmit =(e)=>{
    e.preventDefault();//e->event //By default, submitting a form reloads the page. Using e.preventDefault() prevents the reload and allows you to handle the form submission with JavaScript instead.

    const success=validateForm();

    if(success===true) signup(formData);
  }; 


  return (


    <div className="min-h-screen grid lg:grid-cols-2">
      {/* left hand side */}
      <div className="flex flex-col justify-center items-center p- sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* LOGO */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
              group-hover:bg-primary/20 transition-colors"><MessageSquare className="size-6 text-primary" /></div>
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">Get started with your free account</p>
            </div>
          </div>


          <form onSubmit={handleSubmit} className='space-y-6'>

          <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}//onChange-> when we type, it is going to update fullName in the state.//spread operator (...) to copy all the existing properties of the formData object. Then it updates (or adds) the fullName property with the current value of the input field (e.target.value).
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-10`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>
            
            <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>{/* type="submit"-> This indicates that the button is a submit button for a form. When clicked, it triggers the form's onSubmit event.  */}

          </form>
          

          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Sign in
              </Link>
            </p>
          </div>


        </div>
      </div>
      
      {/* right side */}

      <AuthImagePattern title="Join our community" subtitle="Connect with frineds, share moments, and stay in touch with your loved ones." /> {/* a component */}
              
    </div>
  )
}

export default SignUpPage;

