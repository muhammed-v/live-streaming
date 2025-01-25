import express, { Router } from 'express'
import { protectRoute } from '../middleware/auth.middleware.js';
import { getMessages, getUsersForSidebar, sendMessage } from '../controllers/message.controller.js';

const router = express.Router();

//creating endpoints
router.get("/users",protectRoute,getUsersForSidebar); //to see the users on the sidebar(fetching users)
router.get("/:id",protectRoute,getMessages); //id-> userId that we use to fetch our messages with // at this endpoint, we fetch the message history between the users
router.post("/send/:id",protectRoute,sendMessage);

export default router;