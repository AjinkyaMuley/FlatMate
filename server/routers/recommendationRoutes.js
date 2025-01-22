import { Router } from "express";
import { getRoommateRecommendations, searchRoommates } from "../controllers/recommendationsControllers.js";

const recommendationsRouter = Router();

recommendationsRouter.get('/getRoommatesBySearch',searchRoommates);
recommendationsRouter.post('/getRommatesByRecommendations',getRoommateRecommendations);

export default recommendationsRouter;