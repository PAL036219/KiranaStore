import pkg from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const { sign } = pkg;

const genreateAcessToken = async (userId) => {
  console.log("ENV keys:", {
    access: process.env.ACCESS_TOKEN_SECRET,
  });

  try {
    const token = sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "10h", // Token will expire in 10 hours
    });
    return token;
  } catch (error) {
    console.error("Error generating access token:", error);
    throw new Error("Token generation failed");
  }
};

export default genreateAcessToken;
