// const express = require("express");
import express from "express";
import path from "path";
import authRoute from "./Routes/Auth.Route.js"
import messageRoute from "./Routes/message.Route.js"
import { connectdb } from "./lib/db.js";
import cookieParser from "cookie-parser"
import cors from "cors"
import { ENV } from "./lib/env.js";


const app = express();
app.use(cors({origin:ENV.CLIENT_URL, credentials: true}))
app.use(express.json());
app.use(cookieParser())
const __dirname = path.resolve();

const PORT = ENV.PORT || 3000;
 
app.use("/api/auth", authRoute);
app.use("/api/message", messageRoute);

//make Production ready
if(ENV.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")))

    app.get("*", (_,res)=>{
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    })
}

app.listen(PORT, ()=> {
    console.log('✅ app is running on port: ',PORT);
    connectdb();
});