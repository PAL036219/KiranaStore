import React, { useState, useRef, useEffect } from "react";
import UploadImage from "../../utils/imageupload";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { MdOutlineDeleteOutline } from "react-icons/md";
import {
  FiEdit,
  FiTrash2,
  FiPlus,
  FiRefreshCw,
  FiUpload,
  FiCheck,
  FiX,
} from "react-icons/fi";
import Axios from "../../utils/Axios";
import SummaryAPI from "../../common/SummaryAPI";
import Editsubcategory from "../Editsubcategory";

const Subcategory = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subcategoriesList, setSubcategoriesList] = useState([]);
  const [showeditsub, setshoweditsub] = useState(false);

  //
  const [editingSubcategory, setEditingSubcategory] = useState(null);

  const handleEdit = async (subcategory) => {
    setEditingSubcategory(subcategory);

    setSubcategories({
      name: subcategory.name,
      image: null, // Can't pre-fill image due to security restrictions
      categories: subcategory.category || [],
      status: subcategory.status,
    });
    setShowAddForm(true);
  };
  const [subcategories, setSubcategories] = useState({
    name: "",
    image: null,
    categories: [],
    status: "active",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const allcategory = useSelector((state) => state.product.allcategory);

  const fetchsubcategorydata = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryAPI.getsubcateogrydata,
      });
      const { data: responseData } = response;

      console.log("Full API Response:", responseData); // Debug log

      if (responseData.success) {
        setSubcategoriesList(responseData.data || []);

        // Debug: Check the structure of the subcategories
        if (responseData.data && responseData.data.length > 0) {
          console.log("First subcategory:", responseData.data[0]);
          console.log(
            "Category field type:",
            typeof responseData.data[0].category
          );
          console.log("Category field value:", responseData.data[0].category);

          // Check if allcategory has data
          console.log("All categories from Redux:", allcategory);
        }

        toast.success("Subcategories loaded successfully");
      } else {
        toast.error(responseData.message || "Failed to load subcategories");
        setSubcategoriesList([]);
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      toast.error("Failed to load subcategories");
      setSubcategoriesList([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchsubcategorydata();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubcategories((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    if (categoryId && !subcategories.categories.includes(categoryId)) {
      setSubcategories((prev) => ({
        ...prev,
        categories: [...prev.categories, categoryId],
      }));
    }
  };

  const removeCategory = (categoryIdToRemove) => {
    setSubcategories((prev) => ({
      ...prev,
      categories: prev.categories.filter((id) => id !== categoryIdToRemove),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSubcategories((prev) => ({
        ...prev,
        image: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subcategories.image) {
      toast.error("Please upload an image first");
      return;
    }
   

    if (subcategories.categories.length === 0) {
      toast.error("Please select at least one category");
      return;
    }

    // DEBUG: Check what categories are being sent
    console.log("Categories to be saved:", subcategories.categories);
    console.log("All available categories:", allcategory);

    // Verify each category ID exists in allcategory
    const validCategories = subcategories.categories.filter((categoryId) =>
      allcategory.some((cat) => cat._id === categoryId)
    );

    console.log("Valid category IDs:", validCategories);

    if (validCategories.length === 0) {
      toast.error("Selected categories are not valid");
      return;
    }

    setIsUploading(true);

    try {
      const uploadResponse = await UploadImage(subcategories.image);

      if (uploadResponse && uploadResponse.data && uploadResponse.data.url) {
        const requestData = {
          name: subcategories.name,
          image: uploadResponse.data.url,
          category: validCategories, // Use the validated categories
          status: subcategories.status,
        };

        console.log("Data being sent to backend:", requestData);

        const response = await Axios({
          ...SummaryAPI.addsubcategory,
          data: requestData,
        });

        const { data: responseData } = response;
        if (responseData.success) {
          toast.success("Subcategory created successfully!");
          fetchsubcategorydata();
          setSubcategories({
            name: "",
            image: null,
            categories: [],
            status: "active",
          });
          setImagePreview(null);
          setShowAddForm(false);
        } else {
          toast.error(responseData.message || "Failed to create subcategory");
        }
      } else {
        toast.error("Image upload failed - no URL returned");
      }
    } catch (error) {
      console.error("Error uploading subcategory:", error);
      toast.error(
        error.response?.data?.message ||
          "Error creating subcategory. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const getCategoryNames = (categoryField) => {
    console.log("Category field received:", categoryField);
  console.log("Type of category field:", typeof categoryField);
  
  if (Array.isArray(categoryField)) {
    console.log("Array length:", categoryField.length);
    if (categoryField.length > 0) {
      console.log("First item:", categoryField[0]);
      console.log("Type of first item:", typeof categoryField[0]);
    }
  }
    // Handle empty array case - show helpful message
    if (Array.isArray(categoryField) && categoryField.length === 0) {
      return (
        <div className="text-center">
          <div className="text-red-500">No categories assigned</div>
          <div className="text-xs text-gray-400 mt-1">
            Edit to add categories
          </div>
        </div>
      );
    }

    // Handle null/undefined case
    if (!categoryField) {
      return "No category data";
    }

    // If it's an array of category objects with names (populated from backend)
    if (
      Array.isArray(categoryField) &&
      categoryField[0] &&
      categoryField[0].name
    ) {
      return categoryField.map((cat) => cat.name).join(", ");
    }

    // If it's an array of category IDs (not populated)
    if (
      Array.isArray(categoryField) &&
      categoryField.length > 0 &&
      typeof categoryField[0] === "string"
    ) {
      // Map IDs to category names from allcategory
      const categoryNames = categoryField.map((id) => {
        const category = allcategory.find((cat) => cat._id === id);
        return category ? category.name : `Unknown (${id})`;
      });

      return categoryNames.join(", ");
    }

    // If it's a single category ID string
    if (typeof categoryField === "string") {
      const category = allcategory.find((cat) => cat._id === categoryField);
      return category ? category.name : `Unknown (${categoryField})`;
    }

    // If it's a single category object
    if (categoryField && categoryField.name) {
      return categoryField.name;
    }

    return "No categories assigned";
  };
  useEffect(() => {
    console.log("All categories from Redux:", allcategory);
    console.log("Number of categories:", allcategory.length);
  }, [allcategory]);
  // for the delete the subcategory
  const handledeletesubcategory = async (subcategoryId) => {
    try {
      const response = await Axios({
        ...SummaryAPI.deletesubcategory,
         data: { _id: subcategoryId }, 
      });
      const { data: responseData } = response;

      if (responseData) {
        toast.success("data is deleted Successfully");
        fetchsubcategorydata();
      }
    } catch (error) {
      toast.error("data is not deleted");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Subcategories
            </h1>
            <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">
              Manage your product subcategories
            </p>
          </div>

          <div className="flex gap-2 mt-4 sm:mt-0">
            <button
              onClick={fetchsubcategorydata}
              className="px-3 py-2 md:px-4 md:py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all flex items-center gap-2 text-sm"
            >
              <FiRefreshCw className="text-gray-600" />
              Refresh
            </button>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 md:px-6 md:py-3 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 transition-all duration-300 flex items-center gap-2 text-sm"
            >
              <FiPlus />
              Add Subcategory
            </button>
          </div>
        </div>

        {/* Add Subcategory Form */}
        {showAddForm && (
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                Add New Subcategory
              </h3>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setImagePreview(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={20} />
              </button>
            </div>

            <form
              className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
              onSubmit={handleSubmit}
            >
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Subcategory Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={subcategories.name}
                  onChange={handleChange}
                  placeholder="Enter subcategory name"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Parent Categories *
                </label>
                <select
                  onChange={handleCategoryChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select Categories
                  </option>
                  {allcategory
                    .filter(
                      (category) =>
                        !subcategories.categories.includes(category._id)
                    )
                    .map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                </select>

                {subcategories.categories.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-600 mb-1">
                      Selected Categories:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {subcategories.categories.map((categoryId) => {
                        const category = allcategory.find(
                          (cat) => cat._id === categoryId
                        );
                        return (
                          <div
                            key={categoryId}
                            className="flex items-center bg-blue-50 text-blue-700 rounded-full px-2.5 py-1 text-xs"
                          >
                            {category?.name || "Unknown Category"}
                            <button
                              type="button"
                              onClick={() => removeCategory(categoryId)}
                              className="ml-1.5 text-blue-500 hover:text-blue-700"
                            >
                              <MdOutlineDeleteOutline size={14} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  name="status"
                  value={subcategories.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Image *
                </label>
                <input
                  type="file"
                  name="image"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors text-gray-700 flex items-center justify-center gap-2 text-sm"
                >
                  <FiUpload size={16} />
                  Choose Image
                </button>

                {imagePreview && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-600 mb-1">Image Preview:</p>
                    <div className="relative w-20 h-20 border rounded-lg overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="md:col-span-2 flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setImagePreview(null);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    isUploading ||
                    !subcategories.image ||
                    subcategories.categories.length === 0
                  }
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <FiCheck size={16} />
                      Create Subcategory
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Subcategories List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categories
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
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                        <span className="ml-2 text-gray-500 text-sm">
                          Loading subcategories...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : subcategoriesList.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-4 py-8 text-center text-gray-500 text-sm"
                    >
                      No subcategories found. Click "Add Subcategory" to create
                      one.
                    </td>
                  </tr>
                ) : (
                  subcategoriesList.map((subcategory) => (
                    <tr
                      key={subcategory._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {subcategory.name}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {subcategory.image && (
                          <div className="relative group inline-block">
                            <img
                              src={subcategory.image}
                              alt={subcategory.name}
                              className="w-15 h-15 object-cover transform group-hover:scale-150 transition duration-300 rounded-lg shadow-sm cursor-pointer"
                            />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 max-w-xs">
                        {getCategoryNames(subcategory.category)}
                        <div className="text-xs text-gray-400 mt-1">
                          {Array.isArray(subcategory.category)
                            ? `${subcategory.category.length} categories`
                            : typeof subcategory.category}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            subcategory.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {subcategory.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setshoweditsub(true);
                              setEditingSubcategory(subcategory); // Set the subcategory to edit
                            }}
                            className="text-blue-600 hover:text-blue-800 p-1.5 rounded hover:bg-blue-50 transition-colors"
                          >
                            <FiEdit size={16} />
                          </button>
                          <button
                             onClick={() => handledeletesubcategory(subcategory._id)} 
                            className="text-red-600 hover:text-red-800 p-1.5 rounded hover:bg-red-50 transition-colors"
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
        </div>
      </div>
      {showeditsub && editingSubcategory && (
        <Editsubcategory
          subcategory={editingSubcategory}
          onClose={() => {
            setshoweditsub(false);
            setEditingSubcategory(null);
          }}
          onUpdate={() => {
            setshoweditsub(false);
            setEditingSubcategory(null);
            fetchsubcategorydata(); // Refresh the list
          }}
        />
      )}
    </div>
  );
};

export default Subcategory;
