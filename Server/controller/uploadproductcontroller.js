import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
export const uploadproductcontroller = async (req, res) => {
  try {
    const {
      name,
      image,
      categoryid,
      subcategoryid,
      unit,
      stock,
      price,
      discount = 0, // Default value for discount
      description,
      moredetails = {}, // Default value for moredetails
    } = req.body;

    // Validate mandatory fields
    if (
      !name ||
      !image ||
      !categoryid ||
      !subcategoryid ||
      !unit ||
      !stock ||
      !price ||
      !description
    ) {
      return res.status(400).json({
        message: "Please provide all the mandatory fields",
        error: true,
        success: false,
      });
    }

    // Validate array fields
    if (!Array.isArray(image) || image.length === 0) {
      return res.status(400).json({
        message: "Please provide at least one image",
        error: true,
        success: false,
      });
    }

    if (!Array.isArray(categoryid) || categoryid.length === 0) {
      return res.status(400).json({
        message: "Please provide at least one category",
        error: true,
        success: false,
      });
    }

    if (!Array.isArray(subcategoryid) || subcategoryid.length === 0) {
      return res.status(400).json({
        message: "Please provide at least one subcategory",
        error: true,
        success: false,
      });
    }

    // Validate numeric fields
    if (isNaN(stock) || stock < 0) {
      return res.status(400).json({
        message: "Stock must be a positive number",
        error: true,
        success: false,
      });
    }

    if (isNaN(price) || price <= 0) {
      return res.status(400).json({
        message: "Price must be a positive number",
        error: true,
        success: false,
      });
    }

    if (isNaN(discount) || discount < 0 || discount > 100) {
      return res.status(400).json({
        message: "Discount must be between 0 and 100",
        error: true,
        success: false,
      });
    }

    // Create and save product
    const product = new Product({
      name,
      image,
      categoryid,
      subcategoryid,
      unit,
      stock: parseInt(stock),
      price: parseFloat(price),
      discount: parseFloat(discount),
      description,
      moredetails,
    });

    const savedProduct = await product.save();

    return res.status(201).json({
      message: "Product created successfully",
      data: savedProduct,
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Error in uploadproductcontroller:", error);

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Product with this name already exists",
        error: true,
        success: false,
      });
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: "Validation error: " + errors.join(", "),
        error: true,
        success: false,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
      error: true,
      success: false,
    });
  }
};
// controller for getallproductcontroller
export const getallproductcontroller = async (req, res) => {
  try {
    let { page, limit, search } = req.body;

    // Convert to numbers and set defaults
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    // Validate page and limit
    if (page < 1) page = 1;
    if (limit < 1) limit = 10;
    if (limit > 100) limit = 100;

    // Build query object - Use simple regex for now
    let query = {};
    if (search && search.trim() !== "") {
      query.name = { $regex: search, $options: "i" };
    }

    // Calculate skip value
    const skip = (page - 1) * limit;

    // Execute queries in parallel - REMOVE POPULATE FOR NOW
    const [data, totalcount] = await Promise.all([
      Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Product.countDocuments(query),
    ]);

    return res.json({
      message: "Products retrieved successfully",
      error: false,
      success: true,
      totalcount: totalcount,
      currentPage: page,
      totalPages: Math.ceil(totalcount / limit),
      hasNextPage: page < Math.ceil(totalcount / limit),
      hasPrevPage: page > 1,
      limit: limit,
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: true,
      success: false,
      errorDetails:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
// controller for delete product
export const delteproductcontroller = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.json({
        message: "the product id is not provided",
        success: false,
        error: true,
      });
    }

    const deleteid = await Product.findByIdAndDelete(_id);

    if (deleteid) {
      return res.json({
        message: "the category is deleted Successfully",
        error: false,
        success: true,
      });
    }

    return res.json({
      message: "the category is not deleted ",
      error: true,
      success: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: "message from delete the controller",
      error: true,
      success: false,
    });
  }
};
// controller for getproductbyidcontroller
export const getproductbyidcontroller = async (req, res) => {
  try {
    const { category } = req.body;
    if (!category) {
      return res.json({
        message: "Category not provided",
        success: false,
        error: true,
      });
    }
    const data = await Product.find({ categoryid: category }).limit(10);
    if (data && data.length > 0) {
      return res.json({
        message: "success",
        error: false,
        success: true,
        data: data,
      });
    } else {
      return res.json({
        message: "No products found",
        success: false,
        error: true,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "error",
      error: true,
      success: false,
    });
  }
};
// controller for getproductbythecategoryandsubcategory
export const getproductbythecategoryandsubcategory = async (req, res) => {
  try {
    const { categoryid, subcategoryid, page, limit } = req.body;

    // Convert to numbers and set defaults

    if (page < 1) page = 1;
    if (limit < 1) limit = 10;

    if (!categoryid || !subcategoryid) {
      return res.json({
        message: "categoryid or subcategoryid not provided",
        success: false,
        error: true,
      });
    }
    const query = {
      categoryid: { $in: categoryid },
      subcategoryid: { $in: subcategoryid },
    };
    const skip = (page - 1) * limit;

    const [data, datacount] = await Promise.all([
      Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Product.countDocuments(query),
    ]);

    return res.json({
      message: "data is fetched successfully",
      error: false,
      success: true,
      totalcount: datacount,
      currentPage: page,
      totalPages: Math.ceil(datacount / limit),
      data: data,
    });

    return res.json({
      message: "Products fetched successfully",
      error: false,
      success: true,
      totalcount: datacount,
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      message:
        "error coming from the getproductbythecategoryandsubcategory controller",
      error: true,
      success: false,
    });
  }
};
// controller for  getproductdetailsforproductpage
export const getproductdetailsforproductpage = async (req, res) => {
  try {
    const { productid } = req.body;

    if (!productid) {
      return res.json({
        message: "product id is not provided",
        success: false,
        error: true,
      });
    }
    const data = await Product.findById(productid);
    if (data) {
      return res.json({
        message: "data is fetched successfully",
        error: false,
        success: true,
        data: data,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message:
        "error coming from the getproductdetailsforproductpage controller",
      error: true,
      success: false,
    });
  }
};
// controllers/productController.js
export const getTrendingProducts = async (req, res) => {
  try {
    const { limit = 8, category } = req.query;

    // Build query object - adjust based on your actual schema
    const query = { published: true };

    // If you want to filter by a specific category
    if (category && category !== "all" && category !== "trending") {
      // Adjust this based on your actual category field name
      query.category = category;
    }

    // Get trending products
    const products = await Product.find(query)
      .sort({
        createdAt: -1, // Show newest first
        rating: -1, // Then by highest rating
      })
      .limit(parseInt(limit))
      .select("name price image rating discount stock unit");

    return res.status(200).json({
      message: "Trending products fetched successfully",
      data: products,
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Error in getTrendingProducts:", error);
    return res.status(500).json({
      message: "Error fetching trending products",
      error: true,
      success: false,
    });
  }
};
//controller for the search products

export const searchproductscontroller = async (req, res) => {
  try {
    let { search, page, limit } = req.body;

    if (!page) page = 1;
    if (!limit) limit = 10;

    // Use regex search instead of text search to avoid index issues
    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    // First, try without population to see if basic query works
    const [data, datacount] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Product.countDocuments(query),
    ]);
    
    return res.json({
      message: "data is fetched successfully",
      error: false,
      success: true,
      totalcount: datacount,
      currentPage: page,
      totalPages: Math.ceil(datacount / limit),
      data: data,
    });
  } catch (error) {
    console.error("Controller error:", error);
    return res.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
};
//for grtting the random product in the search page

export const getrandomproductcontroller = async (req, res) => {
  try {
    const randomProducts = await Product.aggregate([{ $sample: { size: 10 } }]);
    res.json({ success: true, data: randomProducts });
    
  } catch (error) {
    return res.status(500).json({
      message: "error coming from the getrandomproductcontroller",
      error: true,
      success: false,
    })
    
  }
}
