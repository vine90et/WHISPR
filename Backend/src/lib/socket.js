import express from "express"
import http from "http"
import {Server} from "socket.io"
import { ENV } from "./env.js";
import { SocketAuthMiddelware } from "../middlaware/socket.auth.middleware.js";

const app = express();

const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:[ENV.CLIENT_URL],
        credentials: true
    }
})

io.use(SocketAuthMiddelware);

export function getRecieverSocketId(userId){
  return userSocketMap.get(userId);
}

//Store online User
const userSocketMap = new Map(); // Map<userId, Set<socketId>>

io.on("connection", (socket) => {
    if (!socket.user) {
        return socket.disconnect();
    }
  console.log("User connected:", socket.user.fullName);

  const userId = socket.userId;

  const sockets = userSocketMap.get(userId) ?? new Set();
  sockets.add(socket.id);
  userSocketMap.set(userId, sockets);

  io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.user.fullName);

    const sockets = userSocketMap.get(userId);

    if (sockets) {
      sockets.delete(socket.id);

      if (sockets.size === 0) {
        userSocketMap.delete(userId);
      }
    }

    io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
  });
});

export {io, server, app};