import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CiTimer } from "react-icons/ci";
import { LuIndianRupee } from "react-icons/lu";
import {
  FaHeart,
  FaRegHeart,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaCartPlus,
  FaMinus,
  FaPlus,
} from "react-icons/fa";
import toast from "react-hot-toast";
import SummaryAPI from "../common/SummaryAPI";
import Axios from "../utils/Axios";
import { useGlobalContext } from "../../provider/globalcontextapi";

const Cardforcategoryshow = ({ data }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [cartQuantity, setCartQuantity] = useState(0); // Track quantity in cart
  const [isUpdatingCart, setIsUpdatingCart] = useState(false);
  const navigate = useNavigate();
  const { fetchcartdetails } = useGlobalContext();

  const fallbackImage =
    "https://images.unsplash.com/photo-1556905055-8f358a7a4b2c?auto=format&fit=crop&w=300&q=80";

  const productData = data || {};
  const productId = productData._id || productData.id || "";
  const productName =
    productData.productName || productData.name || "Product Name";

  // Fetch user's cart on component mount
  useEffect(() => {
    fetchUserCart();
  }, []);

  const fetchUserCart = async () => {
    try {
      const response = await Axios({
        ...SummaryAPI.getUserCart,
        method: "GET",
      });

      if (response.data.success) {
        const cartItems = response.data.data;
        const currentProductInCart = cartItems.find(
          (item) => item.productid === productId
        );

        if (currentProductInCart) {
          setCartQuantity(currentProductInCart.quantity);
        }
      }
    } catch (error) {
      console.log("Error fetching user cart:", error);
    }
  };

  // Handle both single image string and array of images
  const getProductImages = () => {
    if (Array.isArray(productData.image) && productData.image.length > 0) {
      return productData.image;
    } else if (typeof productData.image === "string") {
      return [productData.image];
    } else if (productData.productImage) {
      return [productData.productImage];
    }
    return [fallbackImage];
  };

  const productImages = getProductImages();
  const currentImage = productImages[currentImageIndex];

  const productPrice = productData.price || productData.productPrice || 0;
  const productRating = productData.rating || 0;
  const inStock = productData.stock > 0;
  const originalPrice = productData.originalPrice || productData.price;

  const hasActualDiscount =
    productData.originalPrice && productData.originalPrice > productPrice;
  const discountPercent = hasActualDiscount
    ? Math.round(
        ((productData.originalPrice - productPrice) /
          productData.originalPrice) *
          100
      )
    : 0;

  const productURL = `/product/${productId}/${productName
    .toLowerCase()
    .replace(/\s+/g, "-")}`;

  const handleCardClick = () => {
    navigate(productURL);
  };

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    // setIsWishlisted(!isWishlisted);

    // Call API to add/remove from wishlist
    const response = await Axios({
      ...SummaryAPI.addtowishlist,
      data: { productid: data._id },
    });
    const {data: responseData} = response;
    if (responseData.success) {
      setIsWishlisted(!isWishlisted);
      toast.success(responseData.message || "Wishlist updated");
    } else {
      toast.error(responseData.message || "Something went wrong");
    }
  };

  {/**handle to remove item from wishlist */}


  const handleImageError = () => {
    setImageError(true);
    if (productImages.length > currentImageIndex + 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handleaddtocartclick = async (e) => {
    e.stopPropagation();
    if (isUpdatingCart) return;

    setIsUpdatingCart(true);
    try {
      const response = await Axios({
        ...SummaryAPI.addtocart,
        method: "POST",
        data: {
          productid: data._id,
        },
      });

      const responseData = response.data;
      if (responseData.success) {
        setCartQuantity((prev) => prev + 1);
        toast.success(responseData.message || "Product added to cart");
        if (fetchcartdetails) fetchcartdetails();
      } else {
        toast.error(responseData.message || "Something went wrong");
      }
    } catch (error) {
      console.log("Add to cart error:", error);
      if (error.response?.status === 401) {
        toast.error("Please login to add items to cart");
      } else if (error.response) {
        toast.error(error.response.data.message || "Something went wrong");
      } else if (error.request) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsUpdatingCart(false);
    }
  };

  const handleRemoveFromCart = async (e) => {
    e.stopPropagation();
    if (isUpdatingCart || cartQuantity <= 0) return;

    setIsUpdatingCart(true);
    try {
      const response = await Axios({
        ...SummaryAPI.deletecartitem,
        data: {
          productid: data._id,
        },
      });

      const responseData = response.data;
      if (responseData.success) {
        setCartQuantity((prev) => Math.max(0, prev - 1));
        toast.success(responseData.message || "Product removed from cart");
        if (fetchcartdetails) fetchcartdetails();
      } else {
        toast.error(responseData.message || "Something went wrong");
      }
    } catch (error) {
      console.log("Remove from cart error:", error);
      toast.error("Failed to remove from cart");
    } finally {
      setIsUpdatingCart(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars)
        stars.push(<FaStar key={i} className="text-yellow-400 text-xs" />);
      else if (i === fullStars + 1 && hasHalfStar)
        stars.push(
          <FaStarHalfAlt key={i} className="text-yellow-400 text-xs" />
        );
      else
        stars.push(<FaRegStar key={i} className="text-yellow-400 text-xs" />);
    }
    return stars;
  };

  return (
    <div
      className="bg-white rounded-lg shadow hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer flex flex-col 
                 w-full max-w-[160px] sm:max-w-[180px] md:max-w-full"
      onClick={handleCardClick}
    >
      {/* Image section remains the same */}
      <div className="relative w-full h-28 sm:h-32 md:h-40">
        {discountPercent > 0 && (
          <span className="absolute top-1 left-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full shadow z-10">
            {discountPercent}% OFF
          </span>
        )}

        {productImages.length > 1 && (
          <div className="absolute bottom-1 left-0 right-0 flex justify-center space-x-1 z-10">
            {productImages.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={`w-1.5 h-1.5 rounded-full ${
                  index === currentImageIndex ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}

        <img
          src={imageError ? fallbackImage : currentImage}
          alt={productName}
          onError={handleImageError}
          className="w-full h-full object-cover"
        />
        {/* Wishlist button */}
        <button
          onClick={toggleWishlist}
          className="absolute top-1 right-1 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow z-10"
        >
          {isWishlisted ? (
            <FaHeart className="text-red-500 text-sm" />
          ) : (
            <FaRegHeart className="text-gray-600 text-sm" />
          )}
        </button>
        
      </div>

      {/* Info section */}
      <div className="p-2 flex flex-col flex-grow">
        <h3 className="text-xs sm:text-sm font-medium text-gray-800 mb-1 line-clamp-2">
          {productName}
        </h3>

        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center">{renderStars(productRating)}</div>
          <div className="flex items-center text-gray-500 text-[10px] sm:text-xs">
            <CiTimer className="mr-1" /> 10 MINS
          </div>
        </div>

        <div className="flex items-center mb-2">
          <LuIndianRupee className="text-gray-900" size={12} />
          <p className="text-gray-900 font-bold text-sm sm:text-base">
            {productPrice}
          </p>
          {discountPercent > 0 && productData.originalPrice && (
            <p className="text-gray-400 line-through text-xs sm:text-sm ml-1">
              {productData.originalPrice}
            </p>
          )}
        </div>

        {/* Updated Cart Button */}
        {cartQuantity > 0 ? (
          <div className="flex items-center justify-between bg-blue-100 rounded-md p-1">
            <button
              onClick={handleRemoveFromCart}
              disabled={isUpdatingCart}
              className="w-6 h-6 flex items-center justify-center bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              <FaMinus size={10} />
            </button>
            <span className="text-blue-800 font-bold">{cartQuantity}</span>
            <button
              onClick={handleaddtocartclick}
              disabled={isUpdatingCart || !inStock}
              className="w-6 h-6 flex items-center justify-center bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              <FaPlus size={10} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleaddtocartclick}
            disabled={!inStock || isUpdatingCart}
            className={`w-full flex items-center justify-center py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition ${
              inStock
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            } ${isUpdatingCart ? "opacity-50" : ""}`}
          >
            <FaCartPlus className="mr-1" /> {inStock ? "Add" : "Out"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Cardforcategoryshow;
