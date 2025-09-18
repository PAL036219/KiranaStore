import express from "express";

import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/connectionDB.js";
import router from "./routes/userregistration.route.js";
import CategoryRouter from "./routes/categoryrouteselection.js";
import Imageroute from "./routes/imageroutes.js";
import Category from "./models/category.model.js";

import Subcategoryroute from "./routes/subcategoryroute.js";
import uploadproductroute from "./routes/uploadproductroute.js";
import CartRouter from "./routes/addtocartrouter.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.FRONTEND_URL, 
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());
app.use(morgan());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

const PORT = process.env.PORT || 5000;
app.get("/", (request, response) => {
  ///server to client
  response.json({
    message: "Server is running " + PORT,
  });
});
// User registration route
// Note: Ensure you have the user registration route set up correctly
app.use("/api/user", router);
app.use("/api/CategoryRouter", CategoryRouter);
app.use("/api/imagerouter", Imageroute);
app.use("/api/subcategoryrouter", Subcategoryroute);
app.use("/api/uploadproductrouter", uploadproductroute);
app.use("/api/cart",CartRouter)

// Connect to MongoDB
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(
      `Server is running on port ${PORT}` + " at " + new Date().toLocaleString()
    );
  });
});
