import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { MdDeleteOutline } from "react-icons/md";
import {
  FiEdit,
  FiTrash2,
  FiPlus,
  FiRefreshCw,
  FiUpload,
  FiCheck,
  FiX,
  FiImage,
} from "react-icons/fi";
import UploadImage from "../../utils/imageupload";
import { useSelector } from "react-redux";
import Axios from "../../utils/Axios";
import SummaryAPI from "../../common/SummaryAPI";
import Successalert from "../../utils/Successalert";
import { useNavigate } from "react-router-dom";

const UploadProduct = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    image: [],
    categoryid: [],
    subcategoryid: [],
    unit: "",
    stock: "",
    price: "",
    discount: "",
    description: "",
    moredetails: {},
  });

  const [moreDetails, setMoreDetails] = useState({
    key: "",
    value: "",
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Sample data for demonstration
  const categories = useSelector((state) => state.product.allcategory);

  const subcategories = useSelector((state) => state.product.allsubcategory);
  console.log("subacategorydata", subcategories);

  const units = ["Piece", "Kg", "Gram", "Liter", "Pack", "Set"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    console.log(categoryId);

    if (categoryId && !data.categoryid.includes(categoryId)) {
      setData((prev) => ({
        ...prev,
        categoryid: [...prev.categoryid, categoryId],
        subcategoryid: prev.subcategoryid.filter((id) => {
          const subcat = subcategories.find((sc) => sc._id === id);
          // Keep only subcategories that belong to the newly added category
          return (
            subcat &&
            subcat.category &&
            subcat.category.some((cat) => {
              const catId = typeof cat === "object" ? cat._id : cat;
              return catId === categoryId;
            })
          );
        }),
      }));
    }
  };

  const removeCategory = (categoryIdToRemove) => {
    setData((prev) => ({
      ...prev,
      categoryid: prev.categoryid.filter((id) => id !== categoryIdToRemove),
      subcategoryid: prev.subcategoryid.filter((id) => {
        const subcat = subcategories.find((sc) => sc._id === id);
        // Check if the subcategory has the category we're removing
        return (
          !subcat ||
          !subcat.category ||
          !subcat.category.some((cat) => {
            const catId = typeof cat === "object" ? cat._id : cat;
            return catId === categoryIdToRemove;
          })
        );
      }),
    }));
  };

  const handleSubcategoryChange = (e) => {
    const subcategoryId = e.target.value;
    console.log("subcategoryid", subcategoryId);
    if (subcategoryId && !data.subcategoryid.includes(subcategoryId)) {
      setData((prev) => ({
        ...prev,
        subcategoryid: [...prev.subcategoryid, subcategoryId],
      }));
    }
  };

  const removeSubcategory = (subcategoryIdToRemove) => {
    setData((prev) => ({
      ...prev,
      subcategoryid: prev.subcategoryid.filter(
        (id) => id !== subcategoryIdToRemove
      ),
    }));
  };
  

  const handleImageChange = async (e) => {
    try {
      const files = Array.from(e.target.files);

      if (!files || files.length === 0) {
        toast.error("Please select a file first");
        return;
      }

      if (files.length + data.image.length > 5) {
        toast.error("Maximum 5 images allowed");
        return;
      }

      // Upload each file to Cloudinary
      const uploadPromises = files.map(async (file) => {
        const uploadResponse = await UploadImage(file);
        console.log("Cloudinary response:", uploadResponse);

        if (uploadResponse && uploadResponse.data && uploadResponse.data.url) {
          return uploadResponse.data.url;
        } else {
          throw new Error("Image upload failed - no URL returned");
        }
      });

      // Wait for all uploads to complete
      const uploadedUrls = await Promise.all(uploadPromises);

      // Update state with new URLs
      setData((prev) => ({
        ...prev,
        image: [...prev.image, ...uploadedUrls],
      }));

      // Create previews for immediate feedback
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);

      toast.success("Images uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload images");
    }
  };

  const removeImage = (index) => {
    const newImages = data.image.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    setData((prev) => ({ ...prev, image: newImages }));
    setImagePreviews(newPreviews);
    toast.success("image is deleted");
  };

  const handleMoreDetailsChange = (e) => {
    const { name, value } = e.target;
    setMoreDetails((prev) => ({ ...prev, [name]: value }));
  };

  const addMoreDetails = () => {
    if (moreDetails.key && moreDetails.value) {
      setData((prev) => ({
        ...prev,
        moredetails: {
          ...prev.moredetails,
          [moreDetails.key]: moreDetails.value,
        },
      }));
      setMoreDetails({ key: "", value: "" });
    }
  };

  const removeMoreDetails = (key) => {
    const newDetails = { ...data.moredetails };
    delete newDetails[key];
    setData((prev) => ({ ...prev, moredetails: newDetails }));
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    // Simulate API call
    try {
      const response = await Axios({
        ...SummaryAPI.uploadproduct,
        data: data,
      });
      const { data: responseData } = response;
      if (responseData) {
        toast.success("Product is Successfully created");
        Successalert(responseData.message);
      }
      console.log("response data from product", response);
      setTimeout(() => {
        console.log("Product data:", data);
        setIsUploading(false);

        // Reset form
        setData({
          name: "",
          image: [],
          categoryid: [],
          subcategoryid: [],
          unit: "",
          stock: "",
          price: "",
          discount: "",
          description: "",
          moredetails: {},
        });
        setImagePreviews([]);
      }, 2000);
    } catch (error) {}
  };

  const getFilteredSubcategories = () => {
    console.log("Selected category IDs:", data.categoryid);
    console.log("All subcategories:", subcategories);

    if (!Array.isArray(subcategories)) return [];

    const filtered = subcategories.filter((sc) => {
      // Check if the subcategory has any category that matches selected categories
      return (
        sc.category &&
        sc.category.some((cat) => {
          // Handle both object and string formats
          const catId = typeof cat === "object" ? cat._id : cat;
          return data.categoryid.includes(catId);
        })
      );
    });

    console.log("Filtered subcategories:", filtered);
    return filtered;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Upload Product
            </h1>
            <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">
              Add a new product to your inventory
            </p>
          </div>

          <div className="flex gap-2 mt-4 sm:mt-0">
            <button
              onClick={() => window.location.reload()}
              className="px-3 py-2 md:px-4 md:py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all flex items-center gap-2 text-sm"
            >
              <FiRefreshCw className="text-gray-600" />
              Refresh
            </button>
          </div>
        </div>

        {/* Product Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={data.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={data.description}
                    onChange={handleChange}
                    placeholder="Enter product description"
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>

                {/* Categories */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categories *
                  </label>
                  <div className="flex flex-col gap-3">
                    <select
                      onChange={handleCategoryChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select Categories
                      </option>
                      {categories
                        .filter(
                          (category) => !data.categoryid.includes(category._id)
                        )
                        .map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                    </select>

                    {data.categoryid.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {data.categoryid.map((categoryId) => {
                          const category = categories.find(
                            (cat) => cat._id === categoryId
                          );
                          return (
                            <div
                              key={categoryId}
                              className="flex items-center bg-blue-50 text-blue-700 rounded-full px-3 py-1 text-sm"
                            >
                              {category?.name}
                              <button
                                type="button"
                                onClick={() => removeCategory(categoryId)}
                                className="ml-2 text-blue-500 hover:text-blue-700"
                              >
                                <MdDeleteOutline size={14} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Subcategories */}
                {data.categoryid.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subcategories
                    </label>
                    <div className="flex flex-col gap-3">
                      <select
                        onChange={handleSubcategoryChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Select Subcategories
                        </option>
                        {getFilteredSubcategories()
                          .filter(
                            (subcategory) =>
                              !data.subcategoryid.includes(subcategory._id)
                          )
                          .map((subcategory) => (
                            <option
                              key={subcategory._id}
                              value={subcategory._id}
                            >
                              {subcategory.name}
                            </option>
                          ))}
                      </select>

                      {data.subcategoryid.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {data.subcategoryid.map((subcategoryId) => {
                            const subcategory = subcategories.find(
                              (sc) => sc._id === subcategoryId
                            );
                            return (
                              <div
                                key={subcategoryId}
                                className="flex items-center bg-green-50 text-green-700 rounded-full px-3 py-1 text-sm"
                              >
                                {subcategory?.name}
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeSubcategory(subcategoryId)
                                  }
                                  className="ml-2 text-green-500 hover:text-green-700"
                                >
                                  <MdDeleteOutline size={14} />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Images *
                  </label>
                  <input
                    type="file"
                    multiple
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />

                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={triggerFileInput}
                        disabled={data.image.length >= 5}
                        className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <FiUpload size={18} />
                        <span>Select Images</span>
                      </button>
                      <span className="text-sm text-gray-500">
                        {data.image.length} / 5 images selected
                      </span>
                    </div>

                    {imagePreviews.length > 0 && (
                      <div className="border rounded-lg p-4 bg-gray-50">
                        <p className="text-sm font-medium text-gray-700 mb-3">
                          Image Previews:
                        </p>
                        <div className="grid grid-cols-2  gap-2">
                          {imagePreviews.map((preview, index) => (
                            <div
                              key={index}
                              className="relative group border rounded-lg cursor-pointer overflow-hidden bg-white"
                            >
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-32 object-cover"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="bg-red-500 text-white rounded-full p-1.5 cursor-pointer hover:bg-red-600 transition-colors"
                                >
                                  <FiX size={16} />
                                </button>
                              </div>
                              <div className="p-2 text-xs text-gray-600 truncate">
                                {data.image[index]?.name}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pricing & Stock */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        name="price"
                        value={data.price}
                        onChange={handleChange}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      name="discount"
                      value={data.discount}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                      max="100"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock *
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={data.stock}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                  {/**for the unit section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit *
                    </label>
                    <select
                      name="unit"
                      value={data.unit}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    >
                      <option value="" disabled>
                        Select Unit
                      </option>
                      {units.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* More Details */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Details
                  </label>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        name="key"
                        value={moreDetails.key}
                        onChange={handleMoreDetailsChange}
                        placeholder="Detail name"
                        className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                      <input
                        type="text"
                        name="value"
                        value={moreDetails.value}
                        onChange={handleMoreDetailsChange}
                        placeholder="Detail value"
                        className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addMoreDetails}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors flex items-center gap-1"
                    >
                      <FiPlus size={14} />
                      Add Detail
                    </button>

                    {Object?.keys(data?.moredetails).length > 0 && (
                      <div className="border rounded-lg divide-y">
                        {Object.entries(data.moredetails).map(
                          ([key, value]) => (
                            <div
                              key={key}
                              className="flex justify-between items-center px-3 py-2"
                            >
                              <span className="font-medium">{key}:</span>
                              <div className="flex items-center gap-2">
                                <span>{value}</span>
                                <button
                                  type="button"
                                  onClick={() => removeMoreDetails(key)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <MdDeleteOutline size={14} />
                                </button>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
              <button
                type="submit"
                disabled={
                  isUploading ||
                  !data.name ||
                  !data.price ||
                  !data.stock ||
                  !data.unit ||
                  data.image.length === 0
                }
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <FiUpload size={16} />
                    Upload Product
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadProduct;
