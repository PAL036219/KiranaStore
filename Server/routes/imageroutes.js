import { Router } from "express";
import auth from "../middleware/auth.js";
import UploadImageController from "../controller/uploadimagecontroller.js"
import upload from "../middleware/multerimageupload.js";

 const Imageroute = Router();

 Imageroute.post("/imageupload",auth,upload.single("image"),UploadImageController);

 export default Imageroute;