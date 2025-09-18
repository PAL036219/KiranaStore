import { Router } from "express";
import {
  Addcategorycontroller,
  Deletecategorycontroller,
  Getcategorycontroller,
  Updatecategorycontroller,
} from "../controller/Categorycontroller.js";
import auth from "../middleware/auth.js";

const CategoryRouter = Router();

CategoryRouter.post("/addcategory", auth, Addcategorycontroller);
CategoryRouter.get("/getcategorydata", auth, Getcategorycontroller);

CategoryRouter.put("/updatecategory", auth,Updatecategorycontroller);
CategoryRouter.delete("/deletecategory",auth,Deletecategorycontroller);

export default CategoryRouter;
