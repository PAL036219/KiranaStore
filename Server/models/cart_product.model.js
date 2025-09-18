import mongoose from "mongoose";
const cart_productSchema = new mongoose.Schema({
    productid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
    },
    quantity: {
        type: Number,
        default: 1,
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },

},{
    timestamps: true,
})
const Cart = mongoose.model("cart_product", cart_productSchema);
export default Cart;