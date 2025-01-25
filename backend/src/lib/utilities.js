import jwt from 'jsonwebtoken';// package that allows us to handle the authentication
//to generate token we'll need an environment variable JWT_SECRET... Go to .env

export const generateToken = (userId,res) =>{

    const token = jwt.sign({userId}, //first arg is the payload. once we decode this,we can identify which user belongs to this token
    process.env.JWT_SECRET,{expiresIn:"7d"}); //{} ->object
    res.cookie("jwt",token,{
        maxAge: 7 *24 *60 *60 *1000, // 7 days in millisec
        httpOnly:true, // prevent XSS attacks->cross-site scripting attacks(cannot be accessed by js)
        sameSite: "strict",// CSRF attacks -> cross-site request forgery attacks
        secure: process.env.NODE_ENV !== "development" //https if in production. else http(returns false if in development)
    });

    return token;
}; //in this function, we generate token and send it to user in an http only cookie. expires after 7 days. after that, user has to login again