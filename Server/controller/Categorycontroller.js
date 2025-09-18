import Category from "../models/category.model.js";
import Product from "../models/product.model.js";

export const Addcategorycontroller = async (req, res) => {
  try {
    const { name, image } = req.body;

    console.log("Received data:", { name, image }); // DEBUG

    if (!name || !image) {
      return res.status(400).json({
        message: "Please upload the category name and the image",
        success: false,
        error: true,
      });
    }

    const category = new Category({
      name,
      image,
    });

    console.log("Category to save:", category); // DEBUG

    const savedCategory = await category.save();

    console.log("Saved category:", savedCategory); // DEBUG

    if (!savedCategory) {
      return res.status(500).json({
        message: "Category could not be saved in the backend",
        success: false,
        error: true,
      });
    }

    return res.status(201).json({
      message: "Category added successfully",
      data: savedCategory,
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Error in Addcategorycontroller:", error); // DEBUG
    return res.status(500).json({
      message: "Error in Addcategorycontroller",
      success: false,
      error: true,
      details: error.message,
    });
  }
};
export const Getcategorycontroller = async (req, res) => {
  try {
    const data = await Category.find().sort({createdAt : -1});
    return res.status(200).json({
      // Changed from 500 to 200
      data: data,
      message: "data fetch complete and data is getting from backend",
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(400).json({
      message: "error coming from getcategorycomponent",
      success: false,
      error: true,
    });
  }
};
export const Updatecategorycontroller = async (req, res) => {
  try {
    const { _id, name, image } = req.body;

    const update = await Category.updateOne(
      {
        _id: _id,
      },
      {
        name,
        image,
      }
    );
    console.log("Request body:", req.body); // Debug log

    console.log("Extracted values:", { _id, name, image }); // Debug log
    return res.status(200).json({
      message: "data updated successful",
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: "error coming from the Updatecategorycontroller ",
      error: true,
      success: false,
    });
  }
};
export const Deletecategorycontroller = async (req, res) => {
  try {
    const { _id } = req.body;

    const checksubcategory = await Category.find({
      categoryid: {
        $in: [_id],
      },
    }).countDocuments();
    const checkproductmodel = await Product.find({
      categoryid: {
        $in: [_id],
      },
    }).countDocuments();

    if (checksubcategory > 0 || checkproductmodel > 0) {
      return res.status(400).json({
        message: "this categoty already in used it cannot be deleted",
        success: false,
        error: true,
      });
    }
    const deleteid = await Category.deleteOne({ _id: _id });
    return res.json({
      message: "the category is deleted Successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "error coming from Deletecategorycontroller",
      error: true,
      success: false,
    });
  }
};
