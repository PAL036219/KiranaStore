import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  console.log("=== AUTH MIDDLEWARE ===");
  console.log("Cookies:", req.cookies);
  console.log("Auth header:", req.headers.authorization);
  
  const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
  console.log("Extracted token:", token);
  
  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ message: "No token provided" });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("Decoded token:", decoded);
    
    if (!decoded) {
      console.log("Invalid token decoding");
      return res.status(403).json({ message: "Invalid Authentication" });
    }
    
    console.log("Setting req.userId to:", decoded.id);
    req.userId = decoded.id;
    next();
    
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(403).json({ message: "Please Login" });
  }
};

export default auth;