import mongoose from "mongoose";

const subcategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
   
    category: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category', // This should match your Category model name
      required: true
    }],
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Subcategory = mongoose.model("subcategory", subcategorySchema);
export default Subcategory;