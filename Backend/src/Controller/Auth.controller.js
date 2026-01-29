import { generateToken } from "../lib/utils.js";
import User from "../models/User.Modle.js"
import bcrypt from "bcryptjs"

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
            await newUser.save();

            generateToken(newUser._id, res);

            res.status(201).json({
                id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            })
        }else{
            res.status(400).json({message:"❌ Invalid credentials"});
        }

    } catch (error) {
        console.log("error in signup controller", error);
        res.status(500).json({message: "internal server error"});
    }
}