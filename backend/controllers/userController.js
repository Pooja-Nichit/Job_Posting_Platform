import {User} from '../models/userModel.js';
//import userModel from '../models/userModel.js'; 

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
export const register = async(req,res) =>{
    try{
        const {fullname, email, phoneNumber, password, role} = req.body;
        if(!fullname || !email || !phoneNumber || !password || !role){
            return res.status(400).json({
                     message:"something is missing",
                     success:false
            });
        };
         const RegisterUser = await User.findOne({email});
         if(RegisterUser){
            return res.status(400).json({
                message:'User already exist with this email.',
                success:false,
            })
         }
         const hashedpassword = await bcrypt.hash(password,10);
         await User.create({
            fullname,
            email,
            phoneNumber,
            password:hashedpassword,
            role
        
         });
         return res.status(200).json({
            message:"Account created successfully",
            success: true
         });
    }catch(error){
     console.log(error);
    }
}
export const login = async (req, res)=>{
    try{
        const{email,password,role} = req.body;
        if(!email || !password || !role){
            return res.status(400).json({
                     message:"something is missing",
                     success:false
    });
};
 const LoginUser = await User.findOne({email});
 if(!LoginUser){
    
    return res.status(400).json({
                     message:"Incorrect email or password",
                     success:false
 })
}
const ispasswordMatch = await bcrypt.compare(password, LoginUser.password);
if(!ispasswordMatch){
    return res.status(400).json({
                     message:"Incorrect email or password",
                     success:false

    })               
     };
     if(role !== LoginUser.role){
         return res.status(400).json({
                     message:"Account doesn't exist with current role",
                     success:false
         })
     };
     const tokenData = {
              UserId:LoginUser._id
     }
     const token = await jwt.sign(tokenData,process.env.SECRET_KEY, {expiresIn:'1d'});
     const SafeUser = {
        _id:LoginUser._id,
        fullname:LoginUser.fullname,
        email:LoginUser.email,
        phoneNumber:LoginUser.phoneNumber,
        role:LoginUser.role,
        profile:LoginUser.profile
     }
     return res.status(200).cookie("token", token, {maxAge:1*24*60*60*1000, httpOnly:true, sameSite:'strict'}).json({
        message:`welcome back ${SafeUser.fullname}`,
        User,
        success:true
     })
    }catch(error){
     console.log(error);
    }
}
export const logout = async(req,res)=>{
    try{
        return res.status(200).cookie("token", "", {maxAge:0}).json({
            message:"Logged out successfully",
            success: true
        })
    }catch(error){
     console.log(error);
    }
}
export const updateProfile = async (req,res)=>{
    try{
        const {fullname, email, phoneNumber, bio, skills} = req.body;
        const file =req.file;
       let skillsArray;
        if(skills){
           skillsArray = skills.split(" ,");
        }
        
    const UserId =req.id;
        let existingUser = await User.findById(UserId);
        if(!existingUser){
            return res.status(400).json({
                message:"User not found.",
                success:false
            })
        }
     if(fullname) existingUser.fullname = fullname
     if (email) existingUser.email = email;
     if (phoneNumber) existingUser.phoneNumber = phoneNumber;
     if (bio) existingUser.profile.bio = bio;
     if (skills) existingUser.profile.skills = skillsArray;

    await existingUser.save();

    const updatedUserData = {
      _id: existingUser._id,
      fullname: existingUser.fullname,
      email: existingUser.email,
      phoneNumber: existingUser.phoneNumber,
      role: existingUser.role,
      profile: existingUser.profile,
    };
        return res.status(200).json({
            message:"Profile updated successfully.",
            User,
            success:true
        })
    }catch(error){
     console.log(error);
}
}