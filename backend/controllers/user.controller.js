import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs"
import { z } from "zod";//It checks if the input data matches the schema.It returns an object with:
//success: true and the parsed data if validation passes.

import jwt from "jsonwebtoken";
import errorMap from "zod/locales/en.js";
import { Purchase } from "../models/purchase.model.js";
import { Course } from "../models/course.model.js";
export const signup=async(req,res)=>{
const{firstName,lastName,email,password}=req.body;

const userSchema=z.object({//The .safeParse() method in Zod is used to safely validate and parse data against a schema without throwing errors.
    firstName:z.string().min(3,{message:"firstname should be atleast 3 char long"}),
    lastName:z.string().min(3,{message:"lastname should be atleast 3 char long"}),
    email:z.string().email(),
    password:z.string().min(4,{message:"password must be atleast 4 char long"}),
})
const validateData=userSchema.safeParse(req.body);
if(!validateData.success){
    return res.status(400).json({errors:validateData.error.issues.map(err=>err.message)});
}

const hashPassword=await bcrypt.hash(password,10);
try{
const existingUser=await User.findOne({email:email});
if(existingUser){
    return res.status(400).json({errors:"User already exist"});
}
const newUser=new User({firstName,lastName,email,password:hashPassword});
await newUser.save();

return res.status(201).json({message:"Signup succesfull",newUser});
}
catch(error)
{
    return res.status(500).json({errors:"error in signup"});
    console.log("error in signup",error);
}
};
export const login=async(req,res)=>{
    const {email,password}=req.body;
    try{
        const user=await User.findOne({email:email});
        const isPasswordCorrect=await bcrypt.compare(password,user.password)

        if(!user||!isPasswordCorrect){
            return res.status(403).json({errors:"Invalid credentials"});
        }

        //jwt code
        const token=jwt.sign({
            id:user._id,
            email: user.email,
           firstName: user.firstName
        },process.env.JWT_USER_PASSWORD,
        {expiresIn:"1d"}
    );
        const cookieOptions={
            expires:new Date(Date.now()+24*60*60*1000),//1 day
            httpOnly:true,//cant be accesed by js directly
            secure:process.env.NODE_ENV==="production",//true for https only
            sameSite:"Strict",//CSRF attacks
        }
        res.cookie("jwt",token);
        return res.status(201).json({message:"login successful",user,token});
    }catch(error)
    {
        console.log("error in login",error);
        return res.status(500).json({errors:"Error in login"});
       
    }
};
export const logout=async(req,res)=>{
    try{
        res.clearCookie("jwt");
        res.status(200).json({message:"logged out successfully"});
    }catch(error)
    {
        res.status(500).json({errors:"Error in logout"});
        console.log("error in logout",error);
    }
}
export const purchases=async(req,res)=>{
    const userId=req.userId;
    try{
        const purchased=await Purchase.find({userId});

        let purchasedCourseId=[];
        for(let i=0;i<purchased.length;i++){
            purchasedCourseId.push(purchased[i].courseId);
        }
        const courseData=await Course.find({
            _id:{$in:purchasedCourseId},
        });
        res.status(200).json({purchased,courseData});
    }catch(error){
        res.status(500).json({errors:"Error in purchases"});
        console.log("Error in purchase",error);
    }
};