import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./library/db.js";
import userRouter from "./routes/userRoutes.js"
import messageRouter from "./routes/messageRoutes.js";
import {Server} from "socket.io";

// Express App and http server
const app=express();
const server = http.createServer(app);

// Initialising Socket.io
export const io= new Server(server,{
  cors: {origin:"*"}
})

// Store online Users
export const userSocketMap = {};

// Socket.io connection handler
io.on("connection",(socket)=>{
  const userId = socket.handshake.query.userId;
  console.log("User Connected",userId);

  if(userId){
    userSocketMap[userId]=socket.id;
  }
  // Emit online user to all connected Client
  io.emit("getOnlineUsers",Object.keys(userSocketMap));

  socket.on("disconnect",()=>{
    console.log("User disconnected",userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers",Object.keys(userSocketMap));
  })
})


// Middleware setup
app.use(express.json({limit:"4Mb"}));
app.use(cors());


// Route setup
app.use("/api/status",(req,res)=>res.send("Server is live"));
app.use("/api/auth",userRouter);
app.use("/api/messages",messageRouter);


// Connect DB
await connectDB();

if(process.env.NODE_ENV !== "production"){
    const PORT = process.env.PORT || 8000;
    server.listen(PORT, () => console.log(`Server is live on ${PORT}`));
}

// Export server for vercel
export default server;
