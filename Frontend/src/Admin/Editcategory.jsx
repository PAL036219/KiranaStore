import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import UploadImage from "../utils/imageupload";
import Axios from "../utils/Axios";
import { useNavigate } from "react-router-dom";
import SummaryAPI from "../common/SummaryAPI";
import AxiosToastError from "../utils/AxiosToast";

const Editcategory = ({
  onClose,
  category: propCategory,
  onCategoryUpdated,
}) => {
  const navigate = useNavigate();

  // Use the category passed as prop
  const category = propCategory || {};

  const [data, setData] = useState({
    _id: category._id,
    name: category.name || "",
    image: category.image || "",
  });

  const [file, setFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(category.image || "");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(!!category.image);

  // Update state when category prop changes
  useEffect(() => {
    if (category) {
      setData({
        name: category.name || "",
        image: category.image || "",
      });
      setPreviewImage(category.image || "");
      setImageUploaded(!!category.image);
    }
  }, [category]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreviewImage(URL.createObjectURL(selected));
    setImageUploaded(false);
  };

  const handleUploadCategoryImage = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    setUploading(true);
    try {
      const uploadResponse = await UploadImage(file);
      console.log("Cloudinary response:", uploadResponse);

      if (uploadResponse && uploadResponse.data && uploadResponse.data.url) {
        setData((prev) => ({ ...prev, image: uploadResponse.data.url }));
        setImageUploaded(true);
        toast.success("Image uploaded successfully");
      } else {
        toast.error("Image upload failed - no URL returned");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

 // In your handleSubmit function in Editcategory component
const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("Submitting data:", data);

  if (!data.image) {
    toast.error("Please upload the image first");
    return;
  }

  setLoading(true);
  try {
    const response = await Axios({
      ...SummaryAPI.updatecategory,
      data: {
        ...data,
        _id: category._id // Change id to _id
      },
    });
    
    console.log("Update response:", response);
    
    if (response.data.success) {
      toast.success(response.data.message || "Category updated successfully!");
      
      if (onCategoryUpdated) {
        onCategoryUpdated();
      }
      
      if (onClose) {
        onClose();
      }
    } else {
      toast.error(response.data.message || "Failed to update category");
    }
  } catch (error) {
    console.error("Update error:", error);
    AxiosToastError(error);
  } finally {
    setLoading(false);
  }
};

  return (
    <div>
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Edit Category
            </h3>
          </div>

          {/* Current Image Preview */}
          {category.image && (
            <div className="mb-6 text-center">
              <p className="text-sm text-gray-600 mb-2">Current Image:</p>
              <div className="relative inline-block">
                <img
                  src={category.image}
                  alt="Current category"
                  className="w-32 h-32 object-cover rounded-lg shadow-md border-2 border-blue-200"
                />
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Category Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category Name
              </label>
              <input
                type="text"
                name="name"
                value={data.name}
                onChange={handleOnChange}
                placeholder="Enter category name"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                required
              />
            </div>

            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Update Category Image
              </label>

              <div className="flex flex-col items-center space-y-4">
                {/* File input */}
                <div className="w-full">
                  <label className="flex flex-col items-center px-4 py-6 bg-white text-blue-500 rounded-lg border-2 border-dashed border-blue-300 cursor-pointer hover:bg-blue-50 transition-all duration-300">
                    <svg
                      className="w-8 h-8 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <span className="text-sm font-medium">
                      Select new image
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Preview and Upload Button */}
                {previewImage && (
                  <div className="flex flex-col items-center space-y-3">
                    <div className="relative group">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-40 h-40 object-cover rounded-lg border-2 border-gray-200"
                      />
                    </div>

                    {!imageUploaded ? (
                      <button
                        type="button"
                        onClick={handleUploadCategoryImage}
                        disabled={uploading}
                        className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                          uploading
                            ? "bg-blue-400 cursor-not-allowed text-white"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        {uploading ? "Uploading..." : "Upload New Image"}
                      </button>
                    ) : (
                      <div className="flex items-center text-green-600 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="font-medium">Image Ready</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!data.name || !data.image || loading}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                  !data.name || !data.image || loading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {loading ? "Updating..." : "Update Category"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Editcategory;
