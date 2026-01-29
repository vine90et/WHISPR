// const express = require("express");
import express from "express";
import dotenv from "dotenv"
import path from "path";
import authRoute from "./Routes/Auth.Route.js"
import { connectdb } from "./lib/db.js";

dotenv.config();

const app = express();
app.use(express.json());
const __dirname = path.resolve();

const PORT = process.env.PORT || 3000;

app.use("/api/auth", authRoute)

//make Production ready
if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")))

    app.get("*", (_,res)=>{
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    })
}

app.listen(PORT, ()=> {
    console.log('✅ app is running on port: ',PORT);
    connectdb();
});