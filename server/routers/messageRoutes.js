import { Router } from "express";
import { getAllMessages, getMessageById, sendMessage } from "../controllers/messageControllers.js";

const messageRouter = Router();

messageRouter.post('/send-message',sendMessage);
messageRouter.post('/get-message-by-user/:senderId',getMessageById);
messageRouter.get('/get-all-messages/:id',getAllMessages);

export default messageRouter