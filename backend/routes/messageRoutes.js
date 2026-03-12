import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { imageMessage, textMessage } from "../controllers/messageController.js";

const msgRouter = express.Router();

msgRouter.post("/text", protect, textMessage);
msgRouter.post("/image", protect, imageMessage);

export default msgRouter;
