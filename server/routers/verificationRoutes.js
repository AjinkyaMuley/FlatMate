import { Router } from "express";
import { approveVerifications, getVerifications, requestVerification } from "../controllers/verificationsControllers.js";

const verificationRouter = Router();

verificationRouter.post('/verify-request/:userId',requestVerification);
verificationRouter.get('/get-requests/:id',getVerifications);
verificationRouter.put('/approve-request/:id',approveVerifications)

export default verificationRouter