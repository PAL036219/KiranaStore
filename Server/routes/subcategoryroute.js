import { Router } from "express";
import auth from "../middleware/auth.js";
import { DeleteSubcategorycontroller, Fetchsubcategorycontoller, Subcategorycontroller, Updatesubcategorycontroller } from "../controller/Subcategorycontroller.js";

const Subcategoryroute = Router()

Subcategoryroute.post("/createsubcategory",auth,Subcategorycontroller)
Subcategoryroute.get("/getsubcategory",auth,Fetchsubcategorycontoller)
Subcategoryroute.put("/updatesubcategory",auth,Updatesubcategorycontroller)
Subcategoryroute.delete("/deletesubcategory",auth,DeleteSubcategorycontroller)

export default Subcategoryroute