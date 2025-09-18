import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import SendEmail from "./resendemail.controller.js";
import genreateAcessToken from "../utils/genreateAccessToken.js";
import genreateReferenceToken from "../utils/genreateRefrenceToken.js";
import uploadProfileImage from "../utils/uploadprofilecloudinary.js";
import dotenv from "dotenv";
import genreateOtpForChangePassword from "../utils/genreateOtpforchangepassword.js";
dotenv.config();
// Register a new user
export async function registerUser(req, res) {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password || !phone || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email:email });
    if (userExists && userExists.verify_email === true) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      address
    });

    const savedUser = await newUser.save();

    // Try to send verification email
    try {
      const verifyEmail = await SendEmail({
        Sendto: email,
        subject: "Verify your email Address for the Gokart Store",
        html: `<p>Hi ${name},</p>
               <p>Thank you for registering. Please verify your email by clicking the link below:</p>
               <a href="${process.env.FRONTEND_URL}/verify-email?email=${email}">Verify Email</a>
               <p>If you did not register, please ignore this email.</p>`,
      });

      console.log("Verification email sent successfully:", verifyEmail?.data);
      
      res.status(201).json({
        message: "User registered successfully. Verification email sent.",
        user: savedUser,
      });
      
    } catch (emailError) {
      console.error("Error sending verification email:", emailError);
      
      // Still return success but warn about email issue
      res.status(201).json({
        message: "User registered successfully, but verification email failed to send. Please contact support.",
        user: savedUser,
        emailError: true
      });
    }

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
// Verify user email
export async function verifyUserEmail(req, res) {
  try {
    const { code } = req.body;
    const user = await User.findOne({ _id: code });
    if (!user) {
      return res.status(404).json({ message: "Email not verified" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { verify_email: true },
      { new: true }
    );
    return res.status(200).json({
      message: "Email verified successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}
//login for the user after the email verification
export async function loginUser(req, res) {
  console.log("Login request received");
  console.log("ACCESS_TOKEN_SECRET:", process.env.ACCESS_TOKEN_SECRET);
  console.log("REFRENCE_TOKEN_SECRET:", process.env.REFRENCE_TOKEN_SECRET);

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    if (!user.verify_email) {
      return res.status(403).json({ message: "Email not verified" });
    }
    if (user.status !== "active") {
      return res.status(403).json({
        message: "User is not active, contact the admin",
        success: false,
      });
    }

    const accessToken = await genreateAcessToken(user._id);
    const refrenceToken = await genreateReferenceToken(user._id);

    const cookieOptions = {
      httpOnly: true,
      secure: true, // set false in localhost if needed
      sameSite: "None",
    };

    // ✅ Use res, not response
    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refrenceToken", refrenceToken, cookieOptions);

    return res.status(200).json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email },
      data: { accessToken, refrenceToken },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}
//logout for the user
export async function logoutUser(req, res) {
  try {
    // Get user ID from the authenticated request
    const userId = req.userId;
    // Clear the access and refresh tokens from cookies
    const cookieOptions = {
      httpOnly: true,
      secure: true, // set false in localhost if needed
      sameSite: "None",
    };
    // Clear cookies
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refrence", cookieOptions);

    const RemoveRefrenceToken = await User.findByIdAndUpdate(
      { _id: userId },
      { refrence_Token: "" }
    );

    return res.status(200).json({ message: "Logout successful", success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}
//for the profile image upload
export async function uploadProfileImageforuser(req, res) {
  try {
    const userId = req.userId; // Get user ID from the authenticated request
    const image = req.file; // Use req.file for single file upload
    if (!image) {
      return res.status(400).json({ message: "No image file provided" });
    }
    const uploadResult = await uploadProfileImage(image);
    const updateuser = await User.findByIdAndUpdate(
      userId,
      {
        avatar: uploadResult.url,
      },
      { new: true } // Return the updated user document
    );
    console.log("Image file received:", image);
    return res.status(200).json({
      message: "Profile image uploaded successfully",
      data: updateuser,
    });
  } catch (error) {
    console.error("Error uploading profile image:", error);
    return res.status(500).json({ message: "Failed to upload profile image" });
  }
}
//for update the user details
export async function updateUserDetails(req, res) {
  try {
    const userId = req.userId; // ID from auth middleware
    const { name, email, phone, password, address } = req.body;

    // Build update object only with provided fields
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (password) updateData.password = await bcrypt.hash(password, 10); // hash only if password provided

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true } // return updated user
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User details updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
      from: "updateUserDetails controller",
    });
  }
}
//for forgot password
export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    const userexist = await User.findOne({
      email: email,
    });

    if (!userexist) {
      return res.status(404).json({
        message: "User is not registered with this email",
      });
    }
    const genreatedotp = genreateOtpForChangePassword();
    const otpexpiry = new Date(Date.now() + 15 * 60 * 1000); // OTP valid for 15 minutes

    const updateUser = await User.findByIdAndUpdate(
      userexist._id,
      {
        forgot_password_otp: genreatedotp,
        forgot_password_expiry: new Date(otpexpiry).toISOString(),
      },
      { new: true }
    );
    await SendEmail({
      Sendto: email,
      subject: "Reset your password for the Gokart Store",
      html: `<p>Hi ${userexist.name},</p>
               <p>Your OTP for resetting your password is: <strong>${genreatedotp}</strong></p>
               <p>This OTP is valid for 15 minutes.</p>
               <p>If you did not request this, please ignore this email.</p>
               <p>Thank you! from Gokart Store</p>`,
    });
    if (!updateUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    // Send OTP via email
    return res.status(200).json({
      message: "OTP sent successfully to your email",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
      from: "forgotPassword controller",
    });
  }
}
//verify the otp for the forgot password to reset the password
export async function verifyForgotPasswordOtp(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Email is not registered or invalis" });
    }
    // Check if OTP matches
    const currentTime = new Date();
    if (currentTime > new Date(user.forgot_password_expiry)) {
      return res.status(400).json({
        message: "OTP has expired, please request a new one",
      });
    }
    if (user.forgot_password_otp !== otp) {
      return res
        .status(400)
        .json({ message: "Invalid OTP please enter the Valid OTP" });
    }
    // OTP is valid, proceed to reset password

    return res.status(200).json({
      message: "OTP is valid, you can now reset your password",
      success : true,
      error : false
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
      from: "verifyForgotPasswordOtp controller",
    });
  }
}
// Reset password after OTP verification
export async function resetPasswordafterverification(req, res) {
  try {
    const { email, newPassword, confirmPassword } = req.body;
    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match please enter the correct password",
      });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    // Update the user's password
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        password: hashedPassword,
        forgot_password_otp: null,
        forgot_password_expiry: null,
      },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "Failed to update password" });
    }
    return res.status(200).json({
      message: "Password reset successfully Now you can login with your new password",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
      from: "resetPasswordafterverification controller",
    });
  }
}
//Refrence token genreation
export async function RefrenceToken(req, res) {
  try {
    const refrenceToken =  req.cookies.refrenceToken || req?.header?.authorization?.Split(" ")[1];
    if (!refrenceToken) {
      return res.status(401).json({ message: "Refrence token is required" });
    }
    const decoded = jwt.verify(refrenceToken, process.env.REFRENCE_TOKEN_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid refrence token" });
    }
    console.log("Decoded user ID:", decoded);
   
    const newAccessToken = await genreateAcessToken(decoded.id);
    res.cookie("accessToken", newAccessToken), {
      httpOnly: true,
      secure: true, // set false in localhost if needed
      sameSite: "None",
    }
    return res.status(200).json({
      message: "Access token generated successfully",
      accessToken: newAccessToken,
    });
    
  } 
  catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
      from: "RefrenceToken controller",
    });
    
  }
}
//fot get the user detail after login
export async function GetuserDetailAfterLogin(req, res) {
  try {
    const userId = req.userId

    const user  = await User.findById(userId).select('-password -refresh_Token -address')

     return res.status(200).json({
      message: "User Details",
      data : user,
    });
    
  } catch (error) {
     return res.status(500).json({
      message: "Server error",
      error: error.message,
      from: "GetuserDetailAfterLogin",
      success: true
    });
    
  }
  
}