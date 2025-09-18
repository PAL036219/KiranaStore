import React, { useState, useRef, useEffect } from "react";
import UploadImage from "../utils/imageupload";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FiUpload, FiCheck, FiX } from "react-icons/fi";
import Axios from "../utils/Axios";
import SummaryAPI from "../common/SummaryAPI";

const Editsubcategory = ({ subcategory, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: "",
    image: null,
    categories: [],
    status: "active",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [existingImage, setExistingImage] = useState("");
  const fileInputRef = useRef(null);

  const allcategory = useSelector((state) => state.product.allcategory);

  // Pre-fill form with subcategory data
  useEffect(() => {
    if (subcategory) {
      setFormData({
        name: subcategory.name || "",
        image: null,
        categories: subcategory.category || [],
        status: subcategory.status || "active",
      });
      setExistingImage(subcategory.image || "");
    }
  }, [subcategory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    if (categoryId && !formData.categories.includes(categoryId)) {
      setFormData((prev) => ({
        ...prev,
        categories: [...prev.categories, categoryId],
      }));
    }
  };

  const removeCategory = (categoryIdToRemove) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((id) => id !== categoryIdToRemove),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
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

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.categories.length === 0) {
      toast.error("Please select at least one category");
      return;
    }

    setIsUploading(true);

    try {
      let imageUrl = existingImage;

      // Upload new image if provided
      if (formData.image) {
        console.log("Uploading new image...");
        const uploadResponse = await UploadImage(formData.image);
        console.log("Image upload response:", uploadResponse);

        if (uploadResponse && uploadResponse.data && uploadResponse.data.url) {
          imageUrl = uploadResponse.data.url;
          console.log("New image URL:", imageUrl);
        } else {
          toast.error("Image upload failed");
          setIsUploading(false);
          return;
        }
      }

      const requestData = {
        _id: subcategory._id, // Make sure ID is included
        name: formData.name,
        image: imageUrl,
        category: formData.categories,
        status: formData.status,
      };

      console.log("Data being sent to backend:", requestData);
      console.log("API endpoint:", SummaryAPI.updatesubcategorydata);

      const response = await Axios({
        ...SummaryAPI.updatesubcategorydata,
        data: requestData,
      });

      console.log("Backend response:", response);

      const { data: responseData } = response;
      console.log("Backend response data:", responseData);

      if (responseData.success) {
        toast.success("Subcategory updated successfully!");
        onUpdate(); // Refresh the parent component
        onClose(); // Close the edit form
      } else {
        toast.error(responseData.message || "Failed to update subcategory");
      }
    } catch (error) {
      console.error("Error updating subcategory:", error);
      console.error("Error response:", error.response);

      if (error.response) {
        console.error("Error status:", error.response.status);
        console.error("Error data:", error.response.data);
      }

      toast.error(
        error.response?.data?.message ||
          "Error updating subcategory. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  if (!subcategory) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-gray-100 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg md:text-xl font-semibold text-gray-800">
            Update Subcategory
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 transition-colors"
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
              value={formData.name}
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
                .filter((category) => !formData.categories.includes(category._id))
                .map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
            </select>

            {formData.categories.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-gray-600 mb-1">Selected Categories:</p>
                <div className="flex flex-wrap gap-1.5">
                  {formData.categories.map((categoryId) => {
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
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Image {!existingImage && " *"}
            </label>
            <input
              type="file"
              name="image"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={triggerFileInput}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors text-gray-700 flex items-center justify-center gap-2 text-sm"
              >
                <FiUpload size={16} />
                Change Image
              </button>

              {(imagePreview || existingImage) && (
                <div className="mt-2">
                  <p className="text-xs text-gray-600 mb-1">
                    {imagePreview ? "New Image Preview:" : "Current Image:"}
                  </p>
                  <div className="relative">
                    <img
                      src={imagePreview || existingImage}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                    {imagePreview && (
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <FiX size={14} />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2 flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || formData.categories.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Updating...
                </>
              ) : (
                <>
                  <FiCheck size={16} />
                  Update Subcategory
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Editsubcategory;