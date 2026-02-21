import cloudinary from "../lib/cloudinary.js";
import User from "../models/User.Modle.js";
import Message from "../models/message.moddel.js"
import {getRecieverSocketId, io} from "../lib/socket.js"

export const getAllContacts = async(req,res)=>{
    try {
        const loggedInUserId = req.user.id;
        const filteUser = await User.find({_id: {$ne: loggedInUserId}}).select("-password");

        res.status(200).json(filteUser);
    } catch (error) {
        console.log('Error in getAllContacts', error);
        res.status(500).json({message: 'Internal Server Error'});
    }
}

export const getMessagesByUserId = async(req,res)=>{
    try {
        const myId = req.user.id;
        const {id: userToChatId} = req.params;

        const message = await Message.find({
            $or:[
                {senderId: myId, recieverId: userToChatId},
                {senderId: userToChatId, recieverId: myId},
            ]
        })

        return res.status(200).json(message);
    } catch (error) {
        console.log("Error in getMessageByUserId controller",error);
        res.status(500).json({message:"❌ Internal server error"})
    }
}

export const sendMessage = async (req,res)=>{
    try {
        const {text, image} = req.body;
        const {id: recieverId} = req.params;
        const senderId = req.user.id;

        if(!image && !text){
            return res.status(400).json({message: "❌ Text and image is required" });
        }

        if(senderId.toString() === recieverId.toString()){
            return res.status(400).json({message:"❌ Cannot send a messgage to yourself"});
        }

        const recieverExist = await User.exists({_id: recieverId});
        if(!recieverExist) return res.status(404).json({message: "❌ Reciever not found"})

        let imageUrl;
        if(image){
            const uploderResponce = await cloudinary.uploader.upload(image);
            imageUrl = uploderResponce.secure_url;
        }

        const newMessage = new Message({
            senderId,
            recieverId,
            text,
            image: imageUrl,
        });
        
        await newMessage.save();

        //todo:send message in real time
        const receiverSocketIds  =  getRecieverSocketId(recieverId)
        if(receiverSocketIds ){
            receiverSocketIds.forEach((socketId)=>{
                io.to(socketId).emit("newMessage", newMessage)
            })
        }
        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in send Message Controller", error);
        res.status(500).json({error: "Internal server error"});
    }
}

export const getChatPartners= async(req,res)=>{
    try {
        const loggedInUserId = req.user.id;

        const messages = await Message.find({
            $or:[
                {senderId: loggedInUserId}, {recieverId: loggedInUserId}
            ]
        })

        const chatPartnerIds = [...new Set(messages.map((msg)=>
            msg.senderId.toString() === loggedInUserId.toString()
            ? msg.recieverId.toString()
            : msg.senderId.toString()
            )
        )
    ]
        const chatPartners = await User.find({_id:{$in: chatPartnerIds}}).select('-password');
        res.status(200).json(chatPartners);
    } catch (error) {
        console.log("Error in getChatPartners controller",error);
        res.status(500).json({message:"Internal server error"})
    }
}