import Subcategory from "../models/subcategory.model.js";
import Product from "../models/product.model.js";
import Category from "../models/category.model.js";

export const Subcategorycontroller = async (req, res) => {
  try {
    const { name, category, image } = req.body;

    // Validation - check if required fields are provided
    if (!name || !image || !category || category.length === 0) {
      return res.status(400).json({
        message: "Please provide name, image, and at least one category",
        error: true,
        success: false,
      });
    }

    // Check if subcategory with same name already exists
    const existingSubcategory = await Subcategory.findOne({ name });
    if (existingSubcategory) {
      return res.status(409).json({
        message: "Subcategory with this name already exists",
        error: true,
        success: false,
      });
    }

    const data = {
      name,
      image,
      category,
    };

    // Save to database
    const categoryData = new Subcategory(data);
    const savedSubcategory = await categoryData.save();

    // Populate category details in response
    const populatedSubcategory = await Subcategory.findById(
      savedSubcategory._id
    ).populate("category", "name");

    return res.status(201).json({
      message: "Subcategory created successfully",
      error: false,
      success: true,
      data: populatedSubcategory,
    });
  } catch (error) {
    console.error("Error in Subcategorycontroller:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: true,
    });
  }
};
export const Fetchsubcategorycontoller = async (req, res) => {
  try {
    console.log("1. Starting to fetch subcategories...");

    // Test if model works
    const count = await Subcategory.countDocuments();
    console.log("2. Found", count, "subcategories in database");

    console.log("3. Attempting to populate categories...");
    const data = await Subcategory.find()
      .populate("category", "name")
      .sort({ createdAt: -1 });

    console.log("4. Success! Data:", data);

    return res.json({
      message: "Subcategories fetched successfully",
      success: true,
      error: false,
      data: data,
    });
  } catch (error) {
    console.error("5. ERROR DETAILS:", error.message);
    console.error("6. ERROR STACK:", error.stack);
    return res.status(500).json({
      message: "Error fetching subcategories: " + error.message,
      error: true,
      success: false,
    });
  }
};
export const Updatesubcategorycontroller = async (req, res) => {
  try {
    const { name, image, _id, category } = req.body;

    const checksubid = await Subcategory.findOne({ _id });

    if (!checksubid) {
      return res.json({
        message: "the id is not in the database",
        error: true,
        success: false,
      });
    }

    const updatedata = await Subcategory.findByIdAndUpdate(_id, {
      name,
      image,
      category,
    });
    return res.json({
      message: "data is update successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "message come from the Updatethe subcategory controller",
      success: false,
      error: true,
    });
  }
};
export const DeleteSubcategorycontroller = async (req, res) => {
  try {
    const { _id } = req.body;

    // Validate ID
    if (!_id) {
      return res.status(400).json({
        message: "Subcategory ID is required",
        success: false,
        error: true,
      });
    }

    // Check if any products reference this subcategory
    // Assuming products have a 'subcategory' field
    const productCount = await Product.countDocuments({
      subcategory: _id,
    });

    // Check if any categories reference this subcategory (if applicable)
    // This might not be necessary depending on your schema
    const categoryCount = await Category.countDocuments({
      subcategories: { $in: [_id] },
    });

    if (productCount > 0 || categoryCount > 0) {
      return res.status(400).json({
        message: "This subcategory is in use and cannot be deleted",
        success: false,
        error: true,
      });
    }

    // Delete the subcategory
    const deletedSubcategory = await Subcategory.findByIdAndDelete(_id);

    if (!deletedSubcategory) {
      return res.status(404).json({
        message: "Subcategory not found",
        success: false,
        error: true,
      });
    }

    return res.json({
      message: "Subcategory deleted successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("Delete subcategory error:", error);
    return res.status(500).json({
      message: error.message || "Error deleting subcategory",
      success: false,
      error: true,
    });
  }
};
