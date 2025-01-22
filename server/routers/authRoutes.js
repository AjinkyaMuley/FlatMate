import { Router } from "express";
import { extractToken, login, signup, verifyEmail } from "../controllers/authControllers.js";

const authRouter = Router();

authRouter.post('/signup',signup);
authRouter.post('/login',login);
authRouter.post('/verify-email',verifyEmail);
authRouter.get('/extract-token',extractToken);

export default authRouter;