import mongoose from "mongoose";
const oderSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  orderid: {
    type: String,
    required: [true, "Order ID is required"],
    unique: true,
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
  },
  productdetails: {
   
    name: String,
    image: [],
  },
  payment_id:{
    type: String,
    default: "",
  },
    payment_status: {
        type: String,
        
        default: "",
    },
    delivery_address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "address",

    },
    subtotal:{
        type: Number,
        default: 0,
    },
    totalamount: {
        type: Number,
        default: 0,
    },
    invoice:{
        type: String,
        default: "",
    }

},{
    timestamps: true,
});
const Order = mongoose.model("order", oderSchema);
export default Order;
