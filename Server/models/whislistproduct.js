import mongoose from "mongoose";
const wishlist_productSchema = new mongoose.Schema({
    productid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },

},{
    timestamps: true,
})
const whishlist = mongoose.model("wishlist_product", wishlist_productSchema);
export default whishlist;