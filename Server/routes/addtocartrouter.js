import { Router } from "express";
import auth from "../middleware/auth.js";
import {addtocartcontroller, addtowhishlistcontroller, deletecartitem, getcartdetails, removeItemCompletely} from "../controller/addtocartcontroller.js";

const CartRouter = Router();

CartRouter.post("/getcart",auth,addtocartcontroller)
CartRouter.get("/getcartdetails",auth,getcartdetails)
CartRouter.delete("/deletecartitem/:productid",auth,deletecartitem)
CartRouter.delete("/deletecartitem",auth,deletecartitem)
CartRouter.post("/addtowishlist",auth,addtowhishlistcontroller)
CartRouter.delete("/romvefromcart",auth,removeItemCompletely)


export default CartRouter;