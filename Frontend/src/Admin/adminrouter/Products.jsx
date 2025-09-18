import React from "react";
import { useState, useEffect } from "react";
import Axios from "../../utils/Axios";
import SummaryAPI from "../../common/SummaryAPI";
import {
  FiEye,
  FiEdit,
  FiTrash2,
  FiPlus,
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
} from "react-icons/fi";
import { data, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Products = () => {
  const navigate = useNavigate();
  const [productData, setProductData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        url: SummaryAPI.getallproduct.url,
        method: SummaryAPI.getallproduct.method,
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          page: page,
          limit: 10,
          search: searchTerm,
        },
      });

      if (response.data.success) {
        setProductData(response.data.data);
        setTotalPages(response.data.totalPages || 1);
      } else {
        toast.error(response.data.message || "Failed to fetch products");
      }
    } catch (error) {
      console.error("Full error object:", error);

      if (error.response) {
        toast.error(error.response.data?.message || "Failed to fetch products");
      } else if (error.request) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetail();
  }, [page]);
  console.log(productData)
  

  useEffect(() => {
    // Cleanup function to clear timeout
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle search input with debounce
  const handleSearchChange = (e) => {
     e.preventDefault();
    const value = e.target.value;
    setSearchTerm(value);
    
    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Set new timeout for debounced search
    setSearchTimeout(
      setTimeout(() => {
        setPage(1);
        fetchProductDetail();
      }, 500) // 500ms delay before searching
    );
  };

  const handleSearchSubmit = (e) => {
    
    e.preventDefault();
    // Clear any existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    setPage(1);
    fetchProductDetail();
  };

  // const handleAddProduct = () => {
  //   navigate("/admin/add-product"); // Update this path to your actual add product route
  // };

  // const handleViewProduct = (productId) => {
  //   navigate(`/admin/product/${productId}`); // Update this path to your actual view product route
  // };

  // const handleEditProduct = (productId) => {
  //   navigate(`/admin/edit-product/${productId}`); // Update this path to your actual edit product route
  // };

  const handleDelete = async (_id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      const response = await Axios({
        ...SummaryAPI.deleteproduct,
        data: { _id: _id },
      });

      if (response.data.success) {
        toast.success("Product deleted successfully");
        fetchProductDetail(); // Refresh the list
      } else {
        toast.error(response.data.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
              Products
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Manage your product inventory
            </p>
          </div>

          <button 
           
            className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm sm:text-base"
          >
            <FiPlus size={16} />
            <span className="hidden sm:inline">Add Product</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm mb-4 sm:mb-6">
          <form onSubmit={handleSearchSubmit} className="flex gap-2 sm:gap-3">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              <span className="hidden sm:inline">Search</span>
              <FiSearch size={18} className="sm:hidden" />
            </button>
          </form>
        </div>

        {/* Products Table/Cards */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {isMobile ? (
            /* Mobile View - Cards */
            <div className="divide-y divide-gray-200">
              {productData.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500">
                  {searchTerm ? "No products found for your search" : "No products found"}
                </div>
              ) : (
                productData.map((product) => (
                  <div key={product._id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start gap-3">
                      {product.image && product.image.length > 0 && (
                        <img
                          src={product.image[0]}
                          alt={product.name}
                          className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-semibold text-gray-900">
                            ${product.price}
                            {product.discount > 0 && (
                              <span className="ml-1 text-xs text-green-600">
                                ({product.discount}% off)
                              </span>
                            )}
                          </span>
                          <span className="text-sm text-gray-600">
                            {product.stock} {product.unit}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              product.stock > 0
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {product.stock > 0 ? "In Stock" : "Out of Stock"}
                          </span>
                          <div className="flex gap-2">
                            <button 
                            
                              className="text-blue-600 hover:text-blue-900 p-1"
                            >
                              <FiEye size={16} />
                            </button>
                            <button 
                             
                              className="text-green-600 hover:text-green-900 p-1"
                            >
                              <FiEdit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(_id)}
                              className="text-red-600 hover:text-red-900 p-1"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            /* Desktop View - Table */
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {productData.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        {searchTerm ? "No products found for your search" : "No products found"}
                      </td>
                    </tr>
                  ) : (
                    productData.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {product.image && product.image.length > 0 && (
                              <img
                                src={product.image[0]}
                                alt={product.name}
                                className="h-10 w-10 rounded-full object-cover mr-3"
                              />
                            )}
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                {product.name}
                              </div>
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {product.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${product.price}
                          {product.discount > 0 && (
                            <span className="ml-2 text-xs text-green-600">
                              ({product.discount}% off)
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.stock} {product.unit}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              product.stock > 0
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {product.stock > 0 ? "In Stock" : "Out of Stock"}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleViewProduct(product._id)}
                              className="text-blue-600 hover:text-blue-900"
                              title="View Product"
                            >
                              <FiEye size={16} />
                            </button>
                            <button 
                              
                              className="text-green-600 hover:text-green-900"
                              title="Edit Product"
                            >
                              <FiEdit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(product._id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete Product"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="p-2 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  <FiChevronLeft size={16} />
                </button>

                <span className="text-sm text-gray-700">
                  Page {page} of {totalPages}
                </span>

                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  <FiChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;