import express from "express";
import {protectRoutes} from "../middleware/auth.js"
import { getMessages, getUsersForSidebar, markMessagesAsSeen, sendMessage } from "../controller/messageController.js";

const messageRouter = express.Router();

messageRouter.get("/users",protectRoutes,getUsersForSidebar);
messageRouter.get("/:id",protectRoutes,getMessages);
messageRouter.put("/mark/:id",protectRoutes,markMessagesAsSeen);
messageRouter.post("/send/:id",protectRoutes,sendMessage);

export default messageRouter;
