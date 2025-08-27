import express from "express";
import { getMessages, getMessagesByPage } from "../controllers/messages";
const routerMessages = express.Router();

// RESTful API to fetch messages
routerMessages.get("/", getMessages);

// RESTful API to fetch messages with pagination
routerMessages.get("/paginated", getMessagesByPage);
export default routerMessages;
