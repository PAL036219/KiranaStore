import mongoose from "mongoose";
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    image: {
      type: Array,
      default: [],
    },
    categoryid: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
      },
    ],
    subcategoryid: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subcategory",
      },
    ],
    unit: {
      type: String,
      required: "",
    },
    stock: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      default: "",
    },
    moredetails: {
      type: Object,
      default: {},
    },
    published: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

//for the creating index number of all products

productSchema.index(
  {
    name: "text",
    description: "text"
  },
  {
    weights: {
      name: 10,
      description: 5
    },
    name: "productTextIndex" // Give your index a name
  }
);
const Product = mongoose.model("product", productSchema);
export default Product;
