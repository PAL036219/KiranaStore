import mongoose from "mongoose";
const addressSchema = new mongoose.Schema(
  {
    address_line_1: {
      type: String,
      required: [true, "Address line 1 is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
    },
    state: {
      type: String,
      required: [true, "State is required"],
    },
    country: {
      type: String,
      required: [true, "Country is required"],
    },
    postal_code: {
      type: String,
      required: [true, "Postal code is required"],
    },
    phone: {
      type: Number,
      required: [true, "Phone number is required"],
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
    status:{
        type: Boolean,
        default: true,
    }
  },
  {
    timestamps: true,
  }
);

const Address = mongoose.model("address", addressSchema);
export default Address;