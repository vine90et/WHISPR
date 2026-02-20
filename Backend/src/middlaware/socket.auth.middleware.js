import jwt from "jsonwebtoken"
import User from "../models/User.Modle.js"
import { ENV } from "../lib/env.js"


export const SocketAuthMiddelware = async(socket, next)=>{
    try {
        const token = socket.handshake.headers.cookie
        ?.split("; ")
        .find((row)=> row.startsWith("jwt="))
        .split("=")[1];

        if(!token){
            console.log("Socket connection rejected: No token provided");
            return next(new Error("Unauthorized- No token provided"))
        }

        const decoded = jwt.verify(token, ENV.JWT_SECRET)
        if(!decoded){
            console.log("Socket Connection rejected: Invalid Token")
            return next(new Error("Unauthorized- Invalid Token"));
        }

        const user = await User.findById(decoded.userId).select("-password");
        if(!user){
            console.log("Socket connection rejected: User Not found")
            return next(new Error("User not found"));
        }

        socket.user = user;
        socket.userId = user._id.toString();

        console.log(`Socket authenticated for user ${user.fullName} (${user._id})`)

        next();
    } catch (error) {
        console.log("Error in socket Authentication", error.message);
        return next(new Error("Unauthorized- Autentication failed"))
    }
}