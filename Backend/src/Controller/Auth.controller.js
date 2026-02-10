import { sendWelcomeEmail } from "../emails/emailHandeler.js";
import { ENV } from "../lib/env.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.Modle.js"
import bcrypt from "bcryptjs"
import cloudinary from "../lib/cloudinary.js"
import "dotenv/config"

export const signUp =async(req,res)=>{
    try {
        const {fullName, email, password} = req.body;

        if(!fullName || !email || !password){
            return res.status(400).json({message: "❌ All credentials are required"})
        }

        if(password.length < 6){
            return res.status(400).json({message: "❌ Password must be atLeast 6 characters"});
        }

        // Check if emial is valid: regex;
        const emailRegix = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegix.test(email)){
            return res.status(400).json({message: "❌ Please write a valid email"});
        }

        const user = await User.findOne({email});

        if(user){
            return res.status(400).json({message: "❌ Email already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })

        if(newUser){
            const savedUser = await newUser.save();

            generateToken(savedUser._id, res);

            res.status(201).json({
                id: savedUser._id,
                fullName: savedUser.fullName,
                email: savedUser.email,
                profilePic: savedUser.profilePic,
            })
            try {
                await sendWelcomeEmail(savedUser.fullName, savedUser.email, ENV.CLIENT_URL)
            } catch (error) {
                console.log("❌ Failed to send welcome email", error)
            }
        }else{
            res.status(400).json({message:"❌ Invalid credentials"});
        }

    } catch (error) {
        console.log("error in signup controller", error);
        res.status(500).json({message: "internal server error"});
    }
}

export const login = async (req, res)=>{
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({message:"❌ Invalid credentials"});

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect) return res.status(400).json({message:"❌ Invalid credentials"});

        generateToken(user._id, res);

        return res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            profilePic: user.profilePic,
            email:user.email
        })

    } catch (error) {
        console.error("Error in login controller", error);
        res.status(500).json({message: "❌ Internal srever error"})
    }
}

export const logout = (_,res) =>{
    res.cookie("jwt","",{maxAge:0});
    res.status(200).json({message:"✅ Logged out successfully"})
}

export const updateProfile = async(req,res) =>{
    try {
        const {profilePic} = req.body;
        if(!profilePic) return res.status(400).json({message:"Profile Pic is required"});

        const userId = req.user._id;
        const uplodeResponce = await cloudinary.uploader.upload(profilePic);

        const udatedUser = await User.findByIdAndUpdate(userId, {profilePic: uplodeResponce.secure_url}, {new:true});

        res.status(200).json(udatedUser)
    } catch (error) {
        console.error("Error in update profile controller", error);
        res.status(500).json({message: "❌ Internal srever error"})
    }
}