import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from "../utils/Axios";
import SummaryAPI from "../common/SummaryAPI";
import { FaStar, FaRegStar, FaStarHalfAlt, FaShoppingCart, FaHeart, FaRegHeart, FaMinus, FaPlus } from 'react-icons/fa';
import { CiTimer } from "react-icons/ci";
import { LuIndianRupee } from "react-icons/lu";
import toast from 'react-hot-toast';
import { useGlobalContext } from "../../provider/globalcontextapi";

const Productpagefootercard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartQuantities, setCartQuantities] = useState({});
  const [updatingProducts, setUpdatingProducts] = useState({});
  const navigate = useNavigate();
  const { fetchcartdetails } = useGlobalContext();

  // Fallback mock data
  const mockProducts = [
    {
      _id: "1",
      name: "Wireless Headphones",
      price: 89.99,
      image: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80"],
      rating: 4.5,
      discount: 15,
      category: "Electronics",
      stock: 20
    },
    {
      _id: "2",
      name: "Organic Coffee Blend",
      price: 12.99,
      image: ["https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=300&q=80"],
      rating: 4.2,
      category: "Food & Beverages",
      stock: 15
    },
  ];

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await Axios({
        ...SummaryAPI.gettrendingproducts,
        params: {
          limit: 8,
          category: 'trending'
        }
      });

      if (response.data?.success) {
        setProducts(response.data.data);
      } else {
        setProducts(mockProducts);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Showing sample products instead.");
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCartQuantities = useCallback(async () => {
    try {
      const response = await Axios({
        ...SummaryAPI.getcartdetails,
      });
      
      if (response.data.success) {
        const quantities = {};
        response.data.data.forEach(item => {
          quantities[item.productid] = item.quantity;
        });
        setCartQuantities(quantities);
      }
    } catch (error) {
      console.log("Error fetching cart quantities:", error);
      // Don't show toast for this error as it might be expected for non-logged in users
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCartQuantities();
  }, [fetchProducts, fetchCartQuantities]);

  const handleAddToCart = async (productId, e) => {
    e.stopPropagation();
    if (updatingProducts[productId]) return;
    
    setUpdatingProducts(prev => ({ ...prev, [productId]: true }));
    
    try {
      const response = await Axios({
        ...SummaryAPI.addtocart,
        method: "POST",
        data: { productid: productId },
      });
      
      if (response.data.success) {
        setCartQuantities(prev => ({
          ...prev,
          [productId]: (prev[productId] || 0) + 1
        }));
        toast.success(response.data.message || "Added to cart");
        if(fetchcartdetails) {
          fetchcartdetails();
        }
      } else {
        toast.error(response.data.message || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      if (error.response?.status === 401) {
        toast.error("Please login to add to cart");
      } else {
        toast.error("Failed to add to cart");
      }
    } finally {
      setUpdatingProducts(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleRemoveFromCart = async (productId, removeAll = false, e) => {
    if (e) e.stopPropagation();
    if (updatingProducts[productId] || !cartQuantities[productId]) return;
    
    setUpdatingProducts(prev => ({ ...prev, [productId]: true }));
    
    try {
      const response = await Axios({
        ...SummaryAPI.deletecartitem,
        data: { 
          productid: productId,
          removeAll: removeAll 
        },
      });
      
      if (response.data.success) {
        if (response.data.removedCompletely) {
          // Item was completely removed from cart
          setCartQuantities(prev => {
            const newQuantities = { ...prev };
            delete newQuantities[productId];
            return newQuantities;
          });
        } else {
          // Only one quantity was removed
          setCartQuantities(prev => ({
            ...prev,
            [productId]: Math.max(0, (prev[productId] || 0) - 1)
          }));
        }
        
        toast.success(response.data.message || "Item updated in cart");
        
        // Refresh cart data
        if (fetchcartdetails) {
          fetchcartdetails();
        }
      } else {
        toast.error(response.data.message || "Failed to update cart");
      }
    } catch (error) {
      console.error("Remove from cart error:", error);
      toast.error("Failed to update cart");
    } finally {
      setUpdatingProducts(prev => ({ ...prev, [productId]: false }));
    }
  };

  // Function to remove one item (without the removeAll parameter)
  const handleRemoveOneFromCart = (productId, e) => {
    handleRemoveFromCart(productId, false, e);
  };

  const renderStars = useCallback((rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400 text-xs" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400 text-xs" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400 text-xs" />);
      }
    }
    return stars;
  }, []);

  const handleProductClick = useCallback((productId, productName) => {
    const url = `/product/${productId}/${productName.toLowerCase().replace(/\s+/g, '-')}`;
    navigate(url);
  }, [navigate]);

  if (loading) {
    return (
      <div className="bg-gray-100 py-8 px-4">
        <h2 className="text-2xl font-bold text-center mb-8">You Might Also Like</h2>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
              <div className="bg-gray-300 h-40 rounded-md mb-3"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
              <div className="h-6 bg-gray-300 rounded w-1/2 mb-3"></div>
              <div className="h-8 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 py-8 px-4">
      <h2 className="text-2xl font-bold text-center mb-8">You Might Also Like</h2>
      
      {error && (
        <div className="max-w-7xl mx-auto mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
          <p className="text-yellow-800">{error}</p>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product, index) => {
          const productImage = Array.isArray(product.image) 
            ? product.image[0] 
            : product.image || product.productImage;
            
          const quantity = cartQuantities[product._id] || 0;
          const isUpdating = updatingProducts[product._id];
          const inStock = product.stock > 0;
          
          return (
            <div 
              key={product._id || index}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in flex flex-col"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div 
                className="relative h-40 overflow-hidden cursor-pointer"
                onClick={() => handleProductClick(product._id, product.name || product.productName)}
              >
                <img 
                  src={productImage} 
                  alt={product.name || product.productName}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1556905055-8f358a7a4b2c?auto=format&fit=crop&w=300&q=80";
                  }}
                />
                {product.discount > 0 && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {product.discount}% OFF
                  </span>
                )}
                <button className="absolute top-2 right-2 bg-white rounded-full w-7 h-7 flex items-center justify-center shadow-md hover:bg-red-500 hover:text-white transition-colors">
                  <FaRegHeart className="text-sm" />
                </button>
              </div>
              
              <div className="p-3 flex flex-col flex-grow">
                <p className="text-xs text-gray-500 mb-1">{product.category}</p>
                <h3 
                  className="font-medium text-sm mb-2 line-clamp-2 cursor-pointer hover:text-blue-600 min-h-[40px]"
                  onClick={() => handleProductClick(product._id, product.name || product.productName)}
                >
                  {product.name || product.productName}
                </h3>
                
                <div className="flex items-center mb-2">
                  <div className="flex">
                    {renderStars(product.rating || 4.0)}
                  </div>
                  <span className="text-xs text-gray-500 ml-1">({product.rating || 0})</span>
                </div>
                
                <div className="flex items-center mb-2 text-xs text-gray-500">
                  <CiTimer className="mr-1" /> 10 MINS
                </div>
                
                <div className="flex items-center mb-3 mt-auto">
                  <LuIndianRupee className="text-gray-900" size={14} />
                  <span className="text-gray-900 font-bold text-base">
                    {product.price || product.productPrice}
                  </span>
                  {product.originalPrice && product.originalPrice > (product.price || product.productPrice) && (
                    <span className="text-gray-400 line-through text-sm ml-1">
                      {product.originalPrice}
                    </span>
                  )}
                </div>
                
                {/* Cart Button */}
                {quantity > 0 ? (
                  <div className="flex items-center justify-between bg-blue-100 rounded-md p-1">
                    <button
                      onClick={(e) => handleRemoveOneFromCart(product._id, e)}
                      disabled={isUpdating || !inStock}
                      className="w-6 h-6 flex items-center justify-center bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      <FaMinus size={10} />
                    </button>
                    <span className="text-blue-800 font-bold text-sm">{quantity}</span>
                    <button
                      onClick={(e) => handleAddToCart(product._id, e)}
                      disabled={isUpdating || !inStock}
                      className="w-6 h-6 flex items-center justify-center bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      <FaPlus size={10} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={(e) => handleAddToCart(product._id, e)}
                    disabled={isUpdating || !inStock}
                    className={`w-full flex items-center justify-center py-2 rounded-md text-sm font-medium transition ${
                      inStock
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    } ${isUpdating ? "opacity-50" : ""}`}
                  >
                    <FaShoppingCart className="mr-1" /> 
                    {inStock ? "Add to Cart" : "Out of Stock"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Productpagefootercard;