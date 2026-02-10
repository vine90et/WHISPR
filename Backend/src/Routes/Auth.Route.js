import express from "express";
import {signUp, login, logout, updateProfile} from "../Controller/Auth.controller.js"
import {protectRoute} from "../middlaware/auth.middleware.js"

const route = express.Router();

route.post("/signup", signUp);

route.post("/login", login);

route.post("/logout", logout);

route.put("/update", protectRoute, updateProfile);

route.get("/check", protectRoute, (req,res)=> res.status(200).json(req.user));

export default route;