import express from "express"
import { getAllContacts, getChatPartners, getMessagesByUserId, sendMessage } from "../Controller/message.Controller.js";
import { protectRoute } from "../middlaware/auth.middleware.js";
import { arcjetProtection } from "../middlaware/arcjet.middleware.js";

const route = express.Router();
route.use(arcjetProtection, protectRoute)
route.get('/contacts', getAllContacts);
route.get("/chats", getChatPartners);
route.get('/:id', getMessagesByUserId);
route.post('/send/:id', sendMessage);

export default route