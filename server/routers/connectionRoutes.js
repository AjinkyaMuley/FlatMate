import { Router } from "express";
import { approvedConnections, makeNewConnections, userConnections } from "../controllers/connectionControllers.js";

const connectionRouter = Router();

connectionRouter.post('/request',makeNewConnections);
connectionRouter.put('/approveRequest/:id',approvedConnections);
connectionRouter.get('/getUserRequest/:userId',userConnections);

export default connectionRouter