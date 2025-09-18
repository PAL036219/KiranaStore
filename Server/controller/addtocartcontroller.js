import Cart from "../models/cart_product.model.js";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";

import whishlist from "../models/whislistproduct.js";

export const addtocartcontroller = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.userId) {
      console.log("Authentication failed: No user ID");
      return res.status(401).json({
        message: "Please login to add items to cart",
        success: false,
        error: true,
      });
    }

    const { productid } = req.body;
    console.log("Product ID from request:", productid);

    if (!productid) {
      console.log("No product ID provided");
      return res.status(400).json({
        message: "Product ID is required",
        success: false,
        error: true,
      });
    }

    // Check if product exists
    const product = await Product.findById(productid);
    console.log("Product found:", product);

    if (!product) {
      console.log("Product not found");
      return res.status(404).json({
        message: "Product not found",
        success: false,
        error: true,
      });
    }

    // Check if product is in stock
    if (product.stock < 1) {
      console.log("Product out of stock");
      return res.status(400).json({
        message: "Product is out of stock",
        success: false,
        error: true,
      });
    }

    // Check if product is already in user's cart
    const existingCartItem = await Cart.findOne({
      userid: req.userId,
      productid: productid,
    });

    if (existingCartItem) {
      // If item already exists, increase quantity (if stock allows)
      if (existingCartItem.quantity >= product.stock) {
        console.log("Cannot add more than available stock");
        return res.status(400).json({
          message: "Cannot add more than available stock",
          success: false,
          error: true,
        });
      }

      existingCartItem.quantity += 1;
      const updatedCart = await existingCartItem.save();
      console.log("Quantity updated:", updatedCart);

      return res.status(200).json({
        message: "Item quantity updated in cart",
        success: true,
        error: false,
        data: updatedCart,
      });
    }

    // Create new cart item
    console.log("Creating new cart item");
    const cart_product = new Cart({
      quantity: 1,
      productid: productid,
      userid: req.userId,
    });

    const savedcart = await cart_product.save();
    console.log("Cart item saved:", savedcart);

    // Update user's shopping cart array
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      {
        $addToSet: { shopping_cart: productid },
      },
      { new: true }
    );

    console.log("User updated:", updatedUser);

    if (!updatedUser) {
      // If user update fails, delete the cart item
      console.log("User update failed, deleting cart item");
      await Cart.findByIdAndDelete(savedcart._id);
      return res.status(500).json({
        message: "Failed to update user cart",
        success: false,
        error: true,
      });
    }

    console.log("Item successfully added to cart");
    return res.status(200).json({
      message: "Item added to cart successfully",
      success: true,
      error: false,
      data: savedcart,
    });
  } catch (error) {
    console.error("Error in addtocartcontroller:", error);
    return res.status(500).json({
      message: "Internal server error: " + error.message,
      error: true,
      success: false,
    });
  }
};
export const getcartdetails = async (req, res) => {
  try {
    // Fixed userid extraction
    const userid = req.userId || req.body.userid;

    if (!userid) {
      return res.json({
        message: "User ID is not provided",
        error: true,
        success: false,
      });
    }

    const cartitem = await Cart.find({ userid: userid }).populate("productid");

    return res.json({
      message: "Data fetched successfully",
      error: false,
      success: true,
      data: cartitem,
    });
  } catch (error) {
    console.error("Error in getcartdetails:", error);
    return res.status(500).json({
      message: "Error retrieving cart details",
      error: true,
      success: false,
    });
  }
};

//for delete the cart item
export const deletecartitem = async (req, res) => {
  try {
    console.log("=== DELETE CART ITEM REQUEST ===");
    console.log("Request user ID:", req.userId);
    console.log("Request params:", req.params);
    console.log("Request body:", req.body);

    // Check if user is authenticated
    if (!req.userId) {
      return res.status(401).json({
        message: "Please login to manage cart items",
        success: false,
        error: true,
      });
    }

    // Support both body and params for productid
    let { productid, removeAll = false } = req.body;
    if (!productid && req.params.productid) {
      productid = req.params.productid;
    }

    if (!productid) {
      return res.status(400).json({
        message: "Product ID is required",
        success: false,
        error: true,
      });
    }

    // Find the cart item
    const existingItem = await Cart.findOne({
      userid: req.userId,
      productid: productid,
    });

    if (!existingItem) {
      return res.status(404).json({
        message: "Item not found in cart",
        success: false,
        error: true,
      });
    }

    let result;

    if (removeAll || existingItem.quantity === 1) {
      // Remove the entire item from cart if quantity is 1 or removeAll is true
      result = await Cart.findOneAndDelete({
        userid: req.userId,
        productid: productid,
      });

      // Remove product from user's shopping_cart array
      await User.findByIdAndUpdate(
        req.userId,
        { $pull: { shopping_cart: productid } },
        { new: true }
      );
    } else {
      // Decrease quantity by 1
      result = await Cart.findOneAndUpdate(
        {
          userid: req.userId,
          productid: productid,
        },
        { $inc: { quantity: -1 } }, // Decrement quantity by 1
        { new: true } // Return the updated document
      );
    }

    return res.status(200).json({
      message: removeAll ? "Item removed from cart" : "Quantity decreased",
      success: true,
      error: false,
      data: result,
      removedCompletely: removeAll || existingItem.quantity === 1,
    });
  } catch (error) {
    console.error("Error in deletecartitem controller:", error);

    // Handle specific MongoDB errors
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid product ID format",
        success: false,
        error: true,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
      error: true,
      success: false,
    });
  }
};

//fro add to whishlist controller
export const addtowhishlistcontroller = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.userId) {
      console.log("Authentication failed: No user ID");
      return res.status(401).json({
        message: "Please login to add items to wishlist",
        success: false,
        error: true,
      });
    }
    
    const { productid } = req.body;
    console.log("Product ID from request:", productid);

    if (!productid) {
      console.log("No product ID provided");
      return res.status(400).json({
        message: "Product ID is required",
        success: false,
        error: true,
      });
    }
    
    // IMPORTANT: You should check if product exists in PRODUCTS collection, not wishlist
    // This should reference your Product model, not wishlist
    // Assuming you have a Product model imported
    const product = await Product.findById(productid);
    console.log("Product found:", product);

    if (!product) {
      console.log("Product not found");
      return res.status(404).json({
        message: "Product not found",
        success: false,
        error: true,
      });
    }

    // Check if product is already in user's wishlist
    const existingWishlistItem = await whishlist.findOne({
      userid: req.userId,
      productid: productid,
    });

    if (existingWishlistItem) {
      return res.status(200).json({
        message: "Item already in wishlist",
        success: true,
        error: false,
      });
    }
    
    // Create new wishlist item
    console.log("Creating new wishlist item");
    const wishlist_product = new whishlist({
      productid: productid,
      userid: req.userId,
    });
    
    const savedItem = await wishlist_product.save();
    console.log("Wishlist item saved:", savedItem);

    // If wishlist is saved then update user model
    // You'll need to implement this part based on your User model
    // Example: await User.findByIdAndUpdate(req.userId, {$push: {wishlist: productid}});

    return res.status(200).json({
      message: "Item added to wishlist successfully",
      success: true,
      error: false,
      data: savedItem
    });
    
  } catch (error) {
    console.error("Error in addtowhishlistcontroller:", error);
    return res.status(500).json({
      message: "Error adding to wishlist",
      success: false,
      error: true,
    });
  }
};
// for remove item completely from cart
export const removeItemCompletely = async (req, res) => {
  try {
    console.log("=== COMPLETE REMOVAL REQUEST ===");
    console.log("Request user ID:", req.userId);
    console.log("Request body:", req.body);

    if (!req.userId) {
      return res.status(401).json({
        message: "Please login to manage cart items",
        success: false,
        error: true,
      });
    }

    const { productid } = req.body;
    
    console.log("Extracted productid:", productid);
    console.log("Type of productid:", typeof productid);
    
    if (!productid) {
      return res.status(400).json({
        message: "Product ID is required",
        success: false,
        error: true,
      });
    }

    // Validate if productid is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(productid)) {
      console.log("Invalid ObjectId format:", productid);
      return res.status(400).json({
        message: "Invalid product ID format",
        success: false,
        error: true,
      });
    }

    // Convert to ObjectId
    const productObjectId = new mongoose.Types.ObjectId(productid);

    // Remove the item completely
    const result = await Cart.findOneAndDelete({
      userid: new mongoose.Types.ObjectId(req.userId),
      productid: productObjectId,
    });

    console.log("Database result:", result);

    if (!result) {
      return res.status(404).json({
        message: "Item not found in cart",
        success: false,
        error: true,
      });
    }

    // Remove product from user's shopping_cart array
    await User.findByIdAndUpdate(
      req.userId,
      { $pull: { shopping_cart: productObjectId } },
      { new: true }
    );

    return res.status(200).json({
      message: "Item removed from cart",
      success: true,
      error: false,
      data: result,
    });
  } catch (error) {
    console.error("Error in removeItemCompletely controller:", error);
    console.error("Error stack:", error.stack);

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid product ID format",
        success: false,
        error: true,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
      error: true,
      success: false,
    });
  }
};
