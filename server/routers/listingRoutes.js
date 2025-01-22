import { Router } from "express";
import { addNewListings, deleteListings, getAllListings, getListingsById, getListingsByUser, updateListings } from "../controllers/listingControllers.js";

const listingRouter = Router();

listingRouter.get('/getAllListings',getAllListings);
listingRouter.get('/getAllListingsById/:id',getListingsById);
listingRouter.post('/addNewListings',addNewListings);
listingRouter.put('/updateListings/:id',updateListings);
listingRouter.get('/getListingsByUser/:id',getListingsByUser)
listingRouter.delete('/deleteListings/:id',deleteListings);

export default listingRouter