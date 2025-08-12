import express from "express"
import { verifyToken } from "../middleware/protectedRoute.js";
import { getUserData } from "../controller/userController.js";

const userRoutes = express.Router();

userRoutes.get("/data", verifyToken , getUserData)

export default userRoutes;