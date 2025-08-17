import express from "express";
import routerMessages from "./routes/messages";
const routers = express.Router();
routers.use("/messages", routerMessages);
export default routers;
