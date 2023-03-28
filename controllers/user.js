import {User} from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendCookie } from "../utils/features.js";



export const getAllUsers = async (req,res)=>{
    
}

export const register = async (req,res,next)=>{
    try {
    const {name,email,password} = req.body;

    let user = await User.findOne({email});

    if(user) 
        return res.status(404).json({
            success: false,
            message: "User Already Exist",
    });

    const hashedPassword = await bcrypt.hash(password,10);

    user = await User.create({ name, email, password: hashedPassword })

    sendCookie(user,res,"Registered Succesfully",201);
    } catch (error) {
        next(error)
    }
}

export const login = async (req,res,next)=>{

    try {
        const {email,password} = req.body;

    const user = await User.findOne({email}).select("+password");

    if(!user)
        return res.status(404).json({
            success: false,
            message: "Invalid Email or Password",
        });

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch)
        return res.status(404).json({
            success: false,
            message: "Invalid Email or Password",
        });

    sendCookie(user,res,`Welcome Back, ${user.name}`, 201)
    } catch (error) {
        next(error)
    }
}

export const getMyProfile = async(req,res)=>{
    try {
    const { token } = await req.cookies;

    if(!token) 
        return res.status(404).json({
            success: false,
            message: "Login first",
        })

    const decoded = jwt.verify(token, process.env.JWT_SECREAT)

    const user = await User.findById(decoded._id);
    res.status(200).json({
        success: true,
        user,    
    })
    } catch (error) {
        next(error)
    }
}

export const logout = (req,res)=>{
    
    res.status(200).cookie("token","",{
        expires: new Date(Date.now()),
        
    }).json({
        success: true,
        user: req.user,
        message: "Logged out succesfully",
    })
    
   
}