import { Router } from "express";
import auth from "../middleware/auth.js";
import { delteproductcontroller, getallproductcontroller, getproductbyidcontroller, getproductbythecategoryandsubcategory, getproductdetailsforproductpage, getrandomproductcontroller, getTrendingProducts, searchproductscontroller, uploadproductcontroller } from "../controller/uploadproductcontroller.js";
const uploadproductroute = Router();

uploadproductroute.post("/uploadproduct",auth,uploadproductcontroller)
uploadproductroute.post("/getproduct",auth,getallproductcontroller)
uploadproductroute.delete("/deleteproduct",auth,delteproductcontroller)
uploadproductroute.post("/getproductfromcategory",getproductbyidcontroller)
uploadproductroute.post("/getproductfromcategoryandsubcategory",getproductbythecategoryandsubcategory)
uploadproductroute.post("/getproductdetailsforproductpage",getproductdetailsforproductpage)
uploadproductroute.get("/gettrendingproducts",getTrendingProducts)
//for search the product 
uploadproductroute.post("/searchproducts",searchproductscontroller)
uploadproductroute.get("/getrandomproduct",getrandomproductcontroller)



export default uploadproductroute;