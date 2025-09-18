import jwt from "jsonwebtoken";
const { verify } = jwt;
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/dz1q5v0xj/image/upload/v1735681234/avatar.png",
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    refrence_Token: {
      type: String,
      default: "",
    },
    verify_email: {
      type: Boolean,
      default: false,
    },
    lastlogin_date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "banned"],
      default: "active",
    },
    address_details: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "address",
      },
    ],
    shopping_cart: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "cart_product",
      },
    ],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "wishlist_product",
      },
    ],
    orderhistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "order",
      },
    ],
    forgot_password_otp: {
      type: String,
      default: null,
    },
    forgot_password_expiry: {
      type: Date,
      default: null,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
   timestamps: true,
  }
);
const User = mongoose.model("user", userSchema);
export default User;
