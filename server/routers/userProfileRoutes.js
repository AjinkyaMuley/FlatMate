import { Router } from "express";
import { completeProfile, getUserPreferences, getUserProfile, updateUserPreferences, updateUserProfile } from "../controllers/userProfiles.js";

const profileRouter = Router();

profileRouter.get('/getUserProfile/:id',getUserProfile)
profileRouter.put('/updateUserProfile/:id',updateUserProfile);
profileRouter.get('/getUserPreferences/:id',getUserPreferences);
profileRouter.put('/updateUserPreferences/:id',updateUserPreferences)
profileRouter.post('/completeUserProfile/:userId',completeProfile);

export default profileRouter