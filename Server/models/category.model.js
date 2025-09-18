import mongoose from "mongoose";
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },

    image: {
      type: String,
      required: true,
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
const Category = mongoose.model("Category", categorySchema);
export default Category;
