import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Category from "./category";
import Subcategory from "./Subcategory";
import UploadProduct from "./UploadProduct";
import Products from "./Products";
import Axios from "../../utils/Axios";
import SummaryAPI from "../../common/SummaryAPI";
import Nodata from "../../pages/Nodata";
import Editcategory from "../Editcategory";
import toast from "react-hot-toast";
import { MdOutlineAdminPanelSettings } from "react-icons/md";

const Admin = () => {
  const user = useSelector((state) => state.user);
  const [activeView, setActiveView] = useState("recent");
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openedit, setopenedit] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState({
    name: "",
    image: "",
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const allcategory = useSelector((state) => state.product.allcategory);
  console.log("all category", allcategory);

  // Function to fetch category data
  const fetchCategoryData = async () => {
    try {
      setLoading(true);
      // If you have an API endpoint to fetch categories, use it here
      // const response = await Axios(SummaryAPI.getCategories);
      // setCategoryData(response.data.categories);

      // For now, using the data from Redux store
      if (allcategory && allcategory.length > 0) {
        setCategoryData(allcategory);
      } else {
        setCategoryData([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
      setCategoryData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryData();
  }, [allcategory]);

  const isImageUrlValid = (url) => {
    if (!url || url.trim() === "") return false;
    if (url.includes("res.cloudinary.com")) return true;
    if (url.startsWith("data:image/")) return true;
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setopenedit(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await Axios({
          ...SummaryAPI.deletecategory,
          data: { _id: categoryId },
        });

        if (response.data.success) {
          toast.success("Category deleted successfully");
          fetchCategoryData(); // Refresh the list
        } 
        else {
          toast.error("Failed to delete category");
        }
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("Error deleting category");
      }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen mt-13">
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-40">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md bg-blue-500 text-white flex items-center justify-center"
        >
          <MdOutlineAdminPanelSettings className="text-xl" />
        </button>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Sidebar - Responsive */}
        <div
          className={`bg-gray-900 text-white w-full md:w-56 py-4 px-3 fixed md:static inset-0 z-30 transform ${
            mobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          } transition-transform duration-300`}
        >
          {/* Close button for mobile */}
          <div className="md:hidden flex justify-end p-4">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-white p-2"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="flex items-center justify-center mb-8">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center mr-2">
              <i className="fas fa-cube text-white text-sm"></i>
            </div>
            <h1 className="text-lg font-bold">Admin Panel</h1>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => {
                setActiveView("recent");
                setMobileMenuOpen(false);
              }}
              className={`flex items-center py-3 px-4 rounded-lg w-full text-left transition-colors ${
                activeView === "recent" ? "bg-gray-800" : "hover:bg-gray-800"
              }`}
            >
              <i className="fas fa-home mr-3 text-sm"></i>
              Dashboard
            </button>
            <button className="flex items-center py-3 px-4 rounded-lg w-full text-left hover:bg-gray-800 transition-colors">
              <i className="fas fa-user mr-3 text-sm"></i>
              Users
            </button>
            <button className="flex items-center py-3 px-4 rounded-lg w-full text-left hover:bg-gray-800 transition-colors">
              <i className="fas fa-chart-bar mr-3 text-sm"></i>
              Analytics
            </button>
            <button className="flex items-center py-3 px-4 rounded-lg w-full text-left hover:bg-gray-800 transition-colors">
              <i className="fas fa-cog mr-3 text-sm"></i>
              Settings
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-6 md:ml-0 mt-12 md:mt-0">
          {/* Header - Responsive */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
              <p className="text-gray-600 text-sm">
                Welcome back, {user.name}!
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition">
                <i className="fas fa-bell text-gray-700 text-sm"></i>
              </button>

              <div className="hidden sm:block">
                <h4 className="font-medium text-gray-800 text-sm">
                  {user.name}
                </h4>
                <p className="text-xs text-gray-600">Admin</p>
              </div>

              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                {user.name ? user.name.charAt(0).toUpperCase() : "A"}
              </div>
            </div>
          </div>

          {/* Quick Actions - Responsive */}
          {activeView === "recent" && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  {
                    label: "Category",
                    icon: "layer-group",
                    color: "blue",
                    view: "category",
                  },
                  {
                    label: "Sub Category",
                    icon: "list-alt",
                    color: "green",
                    view: "subcategory",
                  },
                  {
                    label: "Upload Product",
                    icon: "upload",
                    color: "purple",
                    view: "upload",
                  },
                  {
                    label: "Products",
                    icon: "box-open",
                    color: "orange",
                    view: "products",
                  },
                ].map((action) => {
                  // Define gradient classes based on color
                  const gradientClasses = {
                    blue: "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
                    green:
                      "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
                    purple:
                      "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
                    orange:
                      "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
                    red: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
                    indigo:
                      "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700",
                    pink: "bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700",
                    teal: "bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700",
                  };

                  return (
                    <div
                      key={action.label}
                      onClick={() => setActiveView(action.view)}
                      className={`p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-sm flex flex-col items-center justify-center gap-2 text-white font-medium text-xs sm:text-sm transition-all cursor-pointer ${
                        gradientClasses[action.color]
                      } hover:shadow-md hover:scale-105`}
                    >
                      <i
                        className={`fas fa-${action.icon} text-lg sm:text-xl`}
                      ></i>
                      <div className="text-center whitespace-nowrap">
                        {action.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Category Data Display - Responsive */}
          {activeView === "recent" && (
            <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                <h3 className="text-lg font-bold text-gray-800">Categories</h3>
                <button
                  onClick={fetchCategoryData}
                  className="flex items-center text-xs text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <i className="fas fa-sync-alt mr-1 text-xs"></i> Refresh
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : categoryData.length === 0 ? (
                <Nodata
                  message="No categories found"
                  subtitle="Create your first category to get started"
                />
              ) : (
                <div>
                  <p className="text-gray-600 text-sm mb-4">
                    {categoryData.length} categor
                    {categoryData.length === 1 ? "y" : "ies"} available
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {categoryData.map((category) => {
                      const hasValidImage = isImageUrlValid(category.image);

                      return (
                        <div
                          key={category._id}
                          className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-blue-200 group relative"
                        >
                          {/* Category Image */}
                          <div className="relative h-32 sm:h-36 bg-gray-100 overflow-hidden">
                            {hasValidImage ? (
                              <img
                                src={category.image}
                                alt={category.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.nextSibling.style.display = "flex";
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                <i className="fas fa-image text-xl sm:text-2xl text-gray-400"></i>
                              </div>
                            )}

                            {/* Fallback for image error */}
                            <div className="hidden w-full h-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                              <i className="fas fa-image text-xl sm:text-2xl text-gray-400"></i>
                            </div>

                            {/* Hover Overlay with Separated Edit/Delete Buttons */}
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                              {/* Edit Button - Left Side */}
                              <div className="absolute left-2 bottom-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <button
                                  onClick={() => handleEditCategory(category)}
                                  className="bg-white text-blue-600 p-2 rounded-full shadow-md hover:bg-blue-600 hover:text-white transition-colors duration-200"
                                  title="Edit Category"
                                >
                                  <i className="fas fa-edit text-xs"></i>
                                </button>
                              </div>

                              {/* Delete Button - Right Side */}
                              <div className="absolute right-2 bottom-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <button
                                  onClick={() =>
                                    handleDeleteCategory(category._id)
                                  }
                                  className="bg-white text-red-600 p-2 rounded-full shadow-md hover:bg-red-600 hover:text-white transition-colors duration-200"
                                  title="Delete Category"
                                >
                                  <i className="fas fa-trash text-xs"></i>
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Category Info */}
                          <div className="p-2">
                            <h4 className="font-semibold text-gray-800 text-xs sm:text-sm mb-1 truncate">
                              {category.name}
                            </h4>

                            {category.description && (
                              <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                                {category.description}
                              </p>
                            )}

                            <div className="flex justify-between items-center text-xs text-gray-500">
                              <span className="flex items-center">
                                <i className="fas fa-calendar-alt mr-1 text-xs"></i>
                                <span className="hidden xs:inline">
                                  {new Date(
                                    category.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </span>

                              {/* Always visible small action buttons - Separated */}
                              <div className="flex gap-2 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                                <button
                                  onClick={() => handleEditCategory(category)}
                                  className="flex items-center justify-center gap-1 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 
               border border-blue-200 hover:border-blue-300 rounded-lg px-2 py-1 transition-all duration-200 
               hover:shadow-md transform hover:-translate-y-0.5 min-w-[60px]"
                                  title="Edit Category"
                                >
                                  <i className="fas fa-edit text-xs"></i>
                                  <span className="text-xs font-medium">
                                    Edit
                                  </span>
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteCategory(category._id)
                                  }
                                  className="flex items-center justify-center gap-1 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 
               border border-red-200 hover:border-red-300 rounded-lg px-2 py-1 transition-all duration-200 
               hover:shadow-md transform hover:-translate-y-0.5 min-w-[60px]"
                                  title="Delete Category"
                                >
                                  <i className="fas fa-trash text-xs"></i>
                                  <span className="text-xs font-medium">
                                    Delete
                                  </span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Dynamic Views */}
          {activeView !== "recent" && (
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <button
                onClick={() => setActiveView("recent")}
                className="mb-3 px-3 py-1 bg-gray-200 text-gray-800 rounded text-sm hover:bg-gray-300 transition flex items-center"
              >
                <i className="fas fa-arrow-left mr-1 text-xs"></i> Back
              </button>

              {activeView === "category" && <Category />}
              {activeView === "subcategory" && <Subcategory />}
              {activeView === "upload" && <UploadProduct />}
              {activeView === "products" && <Products />}
            </div>
          )}
        </div>
      </div>

      {/* Edit Category Modal */}
      {openedit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Background blur */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => {
              setopenedit(false);
              setSelectedCategory(null);
            }}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto z-50">
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Edit Category</h3>
              <button
                onClick={() => {
                  setopenedit(false);
                  setSelectedCategory(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="p-4">
              <Editcategory
                category={selectedCategory}
                onCategoryAdded={fetchCategoryData}
                onClose={() => {
                  setopenedit(false);
                }}
                onCategoryUpdated={fetchCategoryData}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
