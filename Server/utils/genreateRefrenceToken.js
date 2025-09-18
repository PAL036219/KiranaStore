import pkg from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.model.js";

dotenv.config();

const { sign } = pkg;

const genreateReferenceToken = async (userId) => {
  console.log("ENV keys:", {
    refresh: process.env.REFRENCE_TOKEN_SECRET,
  });

  try {
    const token = sign({ id: userId }, process.env.REFRENCE_TOKEN_SECRET, {
      expiresIn: "30d", // Token will expire in 30 days
    });

    // Update the user's refresh token in the database
    await User.updateOne(
      { _id: userId },
      { refresh_Token: token }
    );

    return token;
  } catch (error) {
    console.error("Error generating reference token:", error);
    throw new Error("Token generation failed");
  }
};

export default genreateReferenceToken;
