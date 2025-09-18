import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryAPI from "../common/SummaryAPI";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Cardforcategoryshow from "./Cardforcategoryshow";
import ValidUrlconverter from "../utils/VlaidUrlConverter";

const Forcategoryproduct = () => {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const categoryId = params.categoryId;
  const categoryName = params.categoryName;
  const subcategoryId = searchParams.get("subcategoryId") || "";
  const subcategoryName = searchParams.get("subcategoryName") || "";

  const AllSubcategory = useSelector(
    (state) => state.product.allsubcategory || []
  );

  const [products, setProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalProducts, setTotalProducts] = useState(0);

  // Fetch products with useCallback to prevent unnecessary re-renders
  const fetchProducts = useCallback(async () => {
    if (!categoryId) return;
    
    setLoading(true);
    setError(null);
    try {
      const requestData = { categoryid: categoryId, page, limit };
      if (subcategoryId) requestData.subcategoryid = subcategoryId;

      const response = await Axios({
        ...SummaryAPI.getproductfromcategoryandsubcategory,
        data: requestData,
      });

      if (response.data.success) {
        setProducts(response.data.data || []);
        setTotalProducts(response.data.totalCount || 0);

        if (response.data.data.length === 0) {
          toast.error(
            subcategoryId
              ? "No products found for this subcategory"
              : "No products found in this category"
          );
        }
      } else {
        toast.error(response.data.message || "Failed to fetch products");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Something went wrong";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [categoryId, subcategoryId, page, limit]);

  // Filter subcategories for this category
  useEffect(() => {
    if (!AllSubcategory || !categoryId) return;

    const filtered = AllSubcategory.filter((sub) =>
      sub.category.some((el) => el._id === categoryId)
    );
    setSubcategories(filtered);
  }, [AllSubcategory, categoryId]);

  // Fetch products when category, subcategory, or page changes
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Reset page when category or subcategory changes
  useEffect(() => {
    setPage(1);
  }, [categoryId, subcategoryId]);

  // Handle subcategory selection
  const handleSubcategoryClick = (subId, subName) => {
    const params = new URLSearchParams();
    if (subId) {
      params.set("subcategoryId", subId);
      params.set("subcategoryName", ValidUrlconverter(subName));
    }
    setSearchParams(params);
  };

  // Pagination controls
  const totalPages = Math.ceil(totalProducts / limit);
  
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => setPage(Math.max(1, page - 1))}
        disabled={page === 1}
        className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
      >
        &laquo; Prev
      </button>
    );
    
    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`px-3 py-1 rounded border ${
            page === i
              ? "bg-blue-500 text-white border-blue-500"
              : "border-gray-300"
          }`}
        >
          {i}
        </button>
      );
    }
    
    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => setPage(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
      >
        Next &raquo;
      </button>
    );
    
    return <div className="flex justify-center gap-2 mt-6 flex-wrap">{pages}</div>;
  };

  return (
    <div className="container mt-10 mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl md:text-2xl font-bold capitalize">
          {subcategoryId ? subcategoryName.replace(/-/g, " ") : categoryName?.replace(/-/g, " ")}
        </h1>
        {subcategoryId && (
          <button 
            onClick={() => handleSubcategoryClick("", "")}
            className="text-blue-500 hover:underline text-sm"
          >
            View all in {categoryName?.replace(/-/g, " ")}
          </button>
        )}
      </div>

      {/* Layout: Subcategories + Products */}
      <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
        {/* Subcategories */}
        <aside className="md:col-span-2">
          <div className="bg-white shadow rounded p-1 sticky top-20">
            <h2 className="font-semibold mb-3">Subcategories</h2>
            <ul className="space-y-2">
              <li 
                className={`cursor-pointer px-3 py-2 rounded hover:bg-gray-100 ${
                  !subcategoryId ? "bg-blue-100 font-medium" : ""
                }`}
               
              >
                All
              </li>
              {subcategories.map((sub) => (
                <li
                  key={sub._id}
                  className={`cursor-pointer px-3 py-2 rounded hover:bg-gray-100 ${
                    subcategoryId === sub._id ? "bg-blue-100 font-medium" : ""
                  }`}
                  onClick={() => handleSubcategoryClick(sub._id, sub.name)}
                >
                  <div className="flex items-center gap">
                    <div className="">
                    <img 
                      src={sub.image}
                      alt={sub.name}
                      className="h-10 w-10 rounded object-cover"
                    />
                    </div>
                    <span>{sub.name}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Products */}
        <main className="md:col-span-5">
          {loading && page === 1 ? (
            <div className="flex flex-col items-center justify-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-2"></div>
              <span>Loading products...</span>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : products.length === 0 ? (
            <div className="text-center py-2">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-lg font-semibold text-gray-600">
                No Products Found
              </h3>
              <p className="text-gray-500">
                {subcategoryId
                  ? "No products in this subcategory yet."
                  : "No products in this category yet."}
              </p>
            </div>
          ) : (
            <>
              <p className="text-gray-600 text-sm mb-2">
                Showing {(page - 1) * limit + 1} to {Math.min(page * limit, totalProducts)} of {totalProducts} products
              </p>
              <div className=" grid md:grid-cols-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {products.map((product) => (
                  <Cardforcategoryshow 
                    key={product._id}
                    data={{
                      _id: product._id,
                      productName: product.name || product.productName,
                      productImage:
                        product.image?.[0] || product.productImage || "",
                      price: product.price || 0,
                      rating: product.rating || 0,
                      inStock:
                        product.inStock !== false ? product.inStock : true,
                      ...product,
                    }}
                  />
                ))}
              </div>
              
              {renderPagination()}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Forcategoryproduct;