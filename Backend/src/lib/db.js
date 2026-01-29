import mongoose from "mongoose";

export const connectdb = async() =>{
    try {
        const {MONGO_URL} = process.env;
        if(!MONGO_URL) throw new Error("Mongo_URI is not set");

        const conn = await mongoose.connect(MONGO_URL);
        console.log("✅ MongoDB connected: ",conn.connection.host);
    } catch (error) {
        console.error("❌ Error connection to MongoDB:", error);
        process.exit(1); //1 status code means fail, 0 means success
    }
}