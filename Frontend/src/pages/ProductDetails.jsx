import React from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryAPI from "../common/SummaryAPI";
import { useEffect, useState } from "react";
import { MdCurrencyRupee } from "react-icons/md";
import Nodata from "./Nodata";
import Productpagefootercard from "./productpagefootercard";
import { FaMinus, FaPlus, FaShoppingCart, FaCheck } from "react-icons/fa";
import { useGlobalContext } from "../../provider/globalcontextapi";

const ProductDetails = () => {
  const params = useParams();
  const productid = params?.id;

  const [data, setData] = useState({
    name: "",
    image: [],
    price: 0,
    description: "",
    discount: 0,
    stock: 0,
    unit: "",
    categoryid: [],
    subcategoryid: [],
    published: true,
    createdAt: "",
    updatedAt: "",
    _id: "",
  });
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [cartQuantity, setCartQuantity] = useState(0);
  const [isUpdatingCart, setIsUpdatingCart] = useState(false);
 
  const {fetchcartdetails} = useGlobalContext();


  const fetchProductDetails = async () => {
    try {
      const response = await Axios({
        ...SummaryAPI.getproductdetailsforproductpage,
        data: {
          productid: productid,
        },
      });
      const { data: responseData } = response;
      console.log(responseData);
      if (responseData?.success) {
        setData(responseData.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error fetching product details");
    } finally {
      setLoading(false);
    }
  };

  const fetchCartQuantity = async () => {
    try {
      const response = await Axios({
        ...SummaryAPI.getUserCart,
        method: "GET",
      });
      
      if (response.data.success) {
        const cartItems = response.data.data;
        const currentProduct = cartItems.find(
          (item) => item.productid === productid
        );
        
        if (currentProduct) {
          setCartQuantity(currentProduct.quantity);
        }
      }
    } catch (error) {
      console.log("Error fetching cart quantity:", error);
    }
  };

  useEffect(() => {
    if (productid) {
      fetchProductDetails();
      fetchCartQuantity();
    }
  }, [productid]);

  const handleAddToCart = async () => {
    if (isUpdatingCart || data.stock <= 0) return;
    
    setIsUpdatingCart(true);
    try {
      const response = await Axios({
        ...SummaryAPI.addtocart,
        method: "POST",
        data: {
          productid: productid,
        },
      });
      
      const responseData = response.data;
      if (responseData.success) {
        setCartQuantity(prev => prev + 1);
        toast.success(responseData.message || "Added to cart successfully");
        if(fetchcartdetails)(
          fetchcartdetails()
        )
      } else {
        toast.error(responseData.message || "Failed to add to cart");
      }
    } catch (error) {
      console.log("Add to cart error:", error);
      if (error.response?.status === 401) {
        toast.error("Please login to add items to cart");
      } else if (error.response) {
        toast.error(error.response.data.message || "Something went wrong");
      } else {
        toast.error("Failed to add to cart");
      }
    } finally {
      setIsUpdatingCart(false);
    }
  };

  const handleRemoveFromCart = async () => {
    if (isUpdatingCart || cartQuantity <= 0) return;
    
    setIsUpdatingCart(true);
    try {
      const response = await Axios({
        ...SummaryAPI.deletecartitem,
        
        data: {
          productid: productid,
        },
      });
      
      const responseData = response.data;
      if (responseData.success) {
        setCartQuantity(prev => Math.max(0, prev - 1));
        toast.success(responseData.message || "Removed from cart");
        if(fetchcartdetails)(
          fetchcartdetails()
        )
      } else {
        toast.error(responseData.message || "Failed to remove from cart");
      }
    } catch (error) {
      console.log("Remove from cart error:", error);
      toast.error("Failed to remove from cart");
    } finally {
      setIsUpdatingCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (data.stock <= 0) return;
    
    // First add to cart, then navigate to cart page
    setIsUpdatingCart(true);
    try {
      const response = await Axios({
        ...SummaryAPI.addtocart,
        method: "POST",
        data: {
          productid: productid,
        },
      });
      
      const responseData = response.data;
      if (responseData.success) {
        setCartQuantity(prev => prev + 1);
        toast.success("Added to cart, redirecting to checkout...");
        if(fetchcartdetails)(
          fetchcartdetails()
        )
        // Navigate to cart/checkout page
        // navigate('/cart');
      } else {
        toast.error(responseData.message || "Failed to add to cart");
      }
    } catch (error) {
      console.log("Buy now error:", error);
      if (error.response?.status === 401) {
        toast.error("Please login to proceed with purchase");
      } else {
        toast.error("Failed to proceed with purchase");
      }
    } finally {
      setIsUpdatingCart(false);
    }
  };

  const calculateDiscountPrice = () => {
    if (data.discount > 0) {
      return data.price - (data.price * data.discount) / 100;
    }
    return data.price;
  };

  const renderStockStatus = () => {
    if (data.stock > 10) {
      return <span className="text-green-600 font-medium">In Stock</span>;
    } else if (data.stock > 0) {
      return (
        <span className="text-orange-600 font-medium">
          Only {data.stock} left
        </span>
      );
    } else {
      return <span className="text-red-600 font-medium">Out of Stock</span>;
    }
  };

  if (loading) {
    return (
      <div className="mt-45">
        <Nodata />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center h-80">
              <img
                src={data.image[selectedImage] || "/placeholder-image.jpg"}
                alt={data.name}
                className="max-h-72 object-contain"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1556905055-8f358a7a4b2c?auto=format&fit=crop&w=300&q=80";
                }}
              />
            </div>
            {data.image.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {data.image.map((img, index) => (
                  <div
                    key={index}
                    className={`w-20 h-20 rounded border-2 cursor-pointer p-1 flex-shrink-0 ${
                      selectedImage === index
                        ? "border-blue-500"
                        : "border-gray-200"
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={img}
                      alt={`${data.name} view ${index + 1}`}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1556905055-8f358a7a4b2c?auto=format&fit=crop&w=300&q=80";
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{data.name}</h1>
              <div className="flex items-center mt-2">
                {renderStockStatus()}
                <span className="mx-2 text-gray-300">|</span>
                {cartQuantity > 0 && (
                  <span className="text-green-600 font-medium">
                    {cartQuantity} in cart
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-baseline">
              {data.discount > 0 ? (
                <>
                  <MdCurrencyRupee />
                  <span className="text-3xl font-bold text-gray-900">
                    {calculateDiscountPrice().toFixed(2)}
                  </span>

                  <span className="ml-2 text-lg text-gray-500 line-through">
                    {data.price}
                  </span>

                  <span className="ml-2 text-2xl bg-red-100 text-green-700 px-2 py-1 rounded">
                    {data.discount}% OFF
                  </span>
                </>
              ) : (
                <>
                  <MdCurrencyRupee />
                  <span className="text-3xl font-bold text-gray-900">
                    {data.price}
                  </span>
                </>
              )}
            </div>

            <div>
              <p className="text-gray-700">{data.description}</p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded-lg">
                <button
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 py-2">{quantity}</span>
                <button
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={data.stock <= 0 || quantity >= data.stock}
                >
                  +
                </button>
              </div>

              <span className="text-sm text-gray-600">
                {data.unit || "unit"}{" "}
                {data.stock > 0
                  ? `(${data.stock} available)`
                  : "(out of stock)"}
              </span>
            </div>

            {/* Cart Quantity Controls */}
            {cartQuantity > 0 ? (
              <div className="flex items-center justify-between bg-blue-100 rounded-lg p-3">
                <button
                  onClick={handleRemoveFromCart}
                  disabled={isUpdatingCart || data.stock <= 0}
                  className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  <FaMinus size={12} />
                </button>
                <span className="text-blue-800 font-bold text-lg">
                  {cartQuantity} in cart
                </span>
                <button
                  onClick={handleAddToCart}
                  disabled={isUpdatingCart || data.stock <= 0 || cartQuantity >= data.stock}
                  className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  <FaPlus size={12} />
                </button>
              </div>
            ) : null}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                className={`flex-1 px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  data.stock <= 0 || isUpdatingCart
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
                onClick={handleAddToCart}
                disabled={data.stock <= 0 || isUpdatingCart}
              >
                {isUpdatingCart ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : cartQuantity > 0 ? (
                  <FaCheck className="h-5 w-5" />
                ) : (
                  <FaShoppingCart className="h-5 w-5" />
                )}
                {cartQuantity > 0 ? "Added to Cart" : "Add to Cart"}
              </button>

              <button
                className={`flex-1 px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  data.stock <= 0 || isUpdatingCart
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
                onClick={handleBuyNow}
                disabled={data.stock <= 0 || isUpdatingCart}
              >
                {isUpdatingCart ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  "Buy Now"
                )}
              </button>
            </div>

            {data.stock <= 0 && (
              <div className="text-red-600 font-medium text-center py-2 bg-red-50 rounded-lg border border-red-200">
                This product is currently out of stock. Orders can't be placed.
              </div>
            )}

            <div className="pt-4 border-t border-gray-200 space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <span className="text-green-500 mr-2">✓</span>
                Free delivery on orders over ₹150
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="text-green-500 mr-2">✓</span>
                30-day money back guarantee
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="text-green-500 mr-2">✓</span>
                Secure payment options
              </div>
            </div>
          </div>
        </div>
      </div>
      <Productpagefootercard />
    </div>
  );
};

export default ProductDetails;