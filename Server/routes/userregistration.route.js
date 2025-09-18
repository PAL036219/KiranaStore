import { Router } from "express";
import {
  registerUser,
  loginUser,
  verifyUserEmail,
  logoutUser,
  uploadProfileImageforuser,
  updateUserDetails,
  forgotPassword,
  verifyForgotPasswordOtp,
  resetPasswordafterverification,
  RefrenceToken,
  GetuserDetailAfterLogin,
} from "../controller/userRegister.controller.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/multerimageupload.js";

const router = Router();

router.post("/register", registerUser);
router.post("/verifyemail", verifyUserEmail);
router.post("/login", loginUser);
router.post("/refrencetoken",RefrenceToken);
router.get("/logout", auth, logoutUser);
router.put(
  "/uploadimage",
  auth,
  upload.single("avatar"),
  uploadProfileImageforuser
);
router.get("/getuserdetail",auth,GetuserDetailAfterLogin)
router.put("/updatedetails", auth, updateUserDetails);
router.put("/forgotPassword", forgotPassword);
router.put("/verifyresetpasswordotp",verifyForgotPasswordOtp);
router.put("/resetpasswordafterverification",resetPasswordafterverification)

export default router;
